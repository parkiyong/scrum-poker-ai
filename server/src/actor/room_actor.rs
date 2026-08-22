use crate::domain::models::{EstimationPhase, Participant, Role, RoomState};
use crate::domain::protocol::{ClientCommand, ServerEvent};
use crate::domain::reveal_gate::{project_room_state, RoomSnapshotData};
use std::collections::HashMap;
use tokio::sync::{broadcast, mpsc, oneshot};
use tracing::info;

#[derive(Debug)]
pub enum RoomCommand {
    ClientMsg {
        participant_id: String,
        command: ClientCommand,
        reply: Option<oneshot::Sender<Result<Participant, String>>>,
    },
    Disconnect {
        participant_id: String,
    },
    GetSnapshot {
        participant_id: String,
        reply: oneshot::Sender<RoomSnapshotData>,
    },
}

pub struct RoomActor {
    pub state: RoomState,
    pub event_tx: broadcast::Sender<ServerEvent>,
}

impl RoomActor {
    pub fn new(slug: String, short_code: String, event_tx: broadcast::Sender<ServerEvent>) -> Self {
        Self {
            state: RoomState::new(slug, short_code),
            event_tx,
        }
    }

    pub async fn run(mut self, mut rx: mpsc::Receiver<RoomCommand>) {
        while let Some(cmd) = rx.recv().await {
            match cmd {
                RoomCommand::ClientMsg {
                    participant_id,
                    command,
                    reply,
                } => {
                    let res = self.handle_client_command(&participant_id, command);
                    if let Some(r) = reply {
                        let _ = r.send(res);
                    }
                }
                RoomCommand::Disconnect { participant_id } => {
                    self.handle_disconnect(&participant_id);
                }
                RoomCommand::GetSnapshot {
                    participant_id,
                    reply,
                } => {
                    let proj = project_room_state(&self.state, Some(&participant_id));
                    let _ = reply.send(proj.inner().clone());
                }
            }
        }
    }

    fn handle_client_command(
        &mut self,
        sender_id: &str,
        command: ClientCommand,
    ) -> Result<Participant, String> {
        match command {
            ClientCommand::JoinRoom {
                participant_id,
                nickname,
                avatar,
                role,
            } => {
                let is_first = self.state.participants.is_empty() || self.state.facilitator_id.is_empty();
                if is_first {
                    self.state.facilitator_id = participant_id.clone();
                }
                let assigned_role = role.unwrap_or(Role::Estimator);

                let p = if let Some(existing) = self.state.participants.get_mut(&participant_id) {
                    existing.connected = true;
                    if let Some(r) = role {
                        existing.role = r;
                    }
                    if !nickname.trim().is_empty() {
                        existing.nickname = nickname.clone();
                    }
                    if !avatar.trim().is_empty() {
                        existing.avatar = avatar.clone();
                    }
                    existing.clone()
                } else {
                    let new_p = Participant {
                        id: participant_id.clone(),
                        nickname: if nickname.trim().is_empty() {
                            format!("Estimator-{}", &participant_id[..participant_id.len().min(4)])
                        } else {
                            nickname.clone()
                        },
                        avatar: if avatar.trim().is_empty() {
                            "indigo".to_string()
                        } else {
                            avatar.clone()
                        },
                        role: assigned_role,
                        connected: true,
                        voted: false,
                        vote: None,
                    };
                    self.state.participants.insert(participant_id.clone(), new_p.clone());
                    new_p
                };

                let _ = self.event_tx.send(ServerEvent::ParticipantJoined {
                    participant_id: p.id.clone(),
                    nickname: p.nickname.clone(),
                    avatar: p.avatar.clone(),
                    role: p.role,
                });

                self.broadcast_snapshot();
                Ok(p)
            }

            ClientCommand::SelectStory { story } => {
                self.state.active_story = story;
                self.reset_votes();
                self.state.phase = EstimationPhase::Idle;
                self.broadcast_snapshot();
                self.get_participant(sender_id)
            }

            ClientCommand::StartVoting => {
                self.reset_votes();
                self.state.phase = EstimationPhase::Voting;
                self.broadcast_snapshot();
                self.get_participant(sender_id)
            }

            ClientCommand::CastVote { value } => {
                let p_clone = if let Some(p) = self.state.participants.get_mut(sender_id) {
                    if p.role == Role::Observer {
                        return Err("Observers cannot cast votes".to_string());
                    }
                    p.voted = true;
                    p.vote = Some(value);
                    Some(p.clone())
                } else {
                    None
                };

                if let Some(p) = p_clone {
                    let _ = self.event_tx.send(ServerEvent::VoteCast {
                        participant_id: sender_id.to_string(),
                    });
                    self.broadcast_snapshot();
                    Ok(p)
                } else {
                    Err("Participant not found".to_string())
                }
            }

            ClientCommand::RetractVote => {
                let p_clone = if let Some(p) = self.state.participants.get_mut(sender_id) {
                    p.voted = false;
                    p.vote = None;
                    Some(p.clone())
                } else {
                    None
                };

                if let Some(p) = p_clone {
                    let _ = self.event_tx.send(ServerEvent::VoteRetracted {
                        participant_id: sender_id.to_string(),
                    });
                    self.broadcast_snapshot();
                    Ok(p)
                } else {
                    Err("Participant not found".to_string())
                }
            }

            ClientCommand::RevealCards => {
                self.state.phase = EstimationPhase::Revealed;
                let votes: HashMap<String, String> = self
                    .state
                    .participants
                    .iter()
                    .filter_map(|(id, p)| p.vote.as_ref().map(|v| (id.clone(), v.clone())))
                    .collect();

                let distribution = self.state.compute_consensus();

                let _ = self.event_tx.send(ServerEvent::CardsRevealed {
                    votes,
                    distribution,
                });

                self.broadcast_snapshot();
                self.get_participant(sender_id)
            }

            ClientCommand::TriggerReVote => {
                self.state.round_number += 1;
                self.reset_votes();
                self.state.phase = EstimationPhase::Voting;

                let _ = self.event_tx.send(ServerEvent::RoundReset {
                    round_number: self.state.round_number,
                });

                self.broadcast_snapshot();
                self.get_participant(sender_id)
            }

            ClientCommand::FinalizeStory { points } => {
                self.state.phase = EstimationPhase::Finalized;
                let pts = points.unwrap_or_else(|| {
                    self.state
                        .compute_consensus()
                        .and_then(|c| c.suggested_points)
                        .unwrap_or_else(|| "5".to_string())
                });

                let story_id = self.state.active_story.as_ref().map(|s| s.id.clone());

                let _ = self.event_tx.send(ServerEvent::StoryFinalized {
                    story_id,
                    points: pts,
                });

                self.broadcast_snapshot();
                self.get_participant(sender_id)
            }

            ClientCommand::UpdateRole {
                target_id,
                new_role,
            } => {
                if let Some(target) = self.state.participants.get_mut(&target_id) {
                    target.role = new_role;
                    if new_role == Role::Observer {
                        target.voted = false;
                        target.vote = None;
                    }
                    let _ = self.event_tx.send(ServerEvent::RoleUpdated {
                        participant_id: target_id.clone(),
                        role: new_role,
                    });
                    self.broadcast_snapshot();
                    self.get_participant(sender_id)
                } else {
                    Err("Target participant not found".to_string())
                }
            }

            ClientCommand::TransferFacilitator { target_id } => {
                if self.state.participants.contains_key(&target_id) {
                    self.state.facilitator_id = target_id.clone();
                    let _ = self.event_tx.send(ServerEvent::FacilitatorChanged {
                        facilitator_id: target_id,
                    });
                    self.broadcast_snapshot();
                    self.get_participant(sender_id)
                } else {
                    Err("Target participant not found".to_string())
                }
            }

            ClientCommand::Ping => {
                let _ = self.event_tx.send(ServerEvent::Pong);
                self.get_participant(sender_id)
            }
        }
    }

    fn handle_disconnect(&mut self, participant_id: &str) {
        if let Some(p) = self.state.participants.get_mut(participant_id) {
            p.connected = false;
            let _ = self.event_tx.send(ServerEvent::ParticipantLeft {
                participant_id: participant_id.to_string(),
            });

            // Facilitator failover promotion if facilitator drops
            if self.state.facilitator_id == participant_id {
                let next_facilitator = self
                    .state
                    .participants
                    .values()
                    .find(|other| other.connected && other.id != participant_id)
                    .map(|other| other.id.clone());

                if let Some(new_id) = next_facilitator {
                    info!("Promoting participant {} to Facilitator", new_id);
                    self.state.facilitator_id = new_id.clone();
                    let _ = self.event_tx.send(ServerEvent::FacilitatorChanged {
                        facilitator_id: new_id,
                    });
                }
            }

            self.broadcast_snapshot();
        }
    }

    fn reset_votes(&mut self) {
        for p in self.state.participants.values_mut() {
            p.voted = false;
            p.vote = None;
        }
    }

    fn broadcast_snapshot(&self) {
        let proj = project_room_state(&self.state, None);
        let _ = self.event_tx.send(ServerEvent::RoomSnapshot {
            state: proj.inner().clone(),
        });
    }

    fn get_participant(&self, participant_id: &str) -> Result<Participant, String> {
        self.state
            .participants
            .get(participant_id)
            .cloned()
            .ok_or_else(|| "Participant not found".to_string())
    }
}
