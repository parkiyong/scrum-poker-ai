use crate::domain::models::{ConsensusSummary, Role, Story};
use crate::domain::reveal_gate::RoomSnapshotData;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum ClientCommand {
    JoinRoom {
        participant_id: String,
        nickname: String,
        avatar: String,
        #[serde(default)]
        role: Option<Role>,
    },
    SelectStory {
        story: Option<Story>,
    },
    StartVoting,
    CastVote {
        value: String,
    },
    RetractVote,
    RevealCards,
    TriggerReVote,
    FinalizeStory {
        points: Option<String>,
    },
    UpdateRole {
        target_id: String,
        new_role: Role,
    },
    TransferFacilitator {
        target_id: String,
    },
    Ping,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum ServerEvent {
    RoomSnapshot {
        state: RoomSnapshotData,
    },
    ParticipantJoined {
        participant_id: String,
        nickname: String,
        avatar: String,
        role: Role,
    },
    ParticipantLeft {
        participant_id: String,
    },
    VoteCast {
        participant_id: String,
    },
    VoteRetracted {
        participant_id: String,
    },
    CardsRevealed {
        votes: HashMap<String, String>,
        distribution: Option<ConsensusSummary>,
    },
    RoundReset {
        round_number: u32,
    },
    StoryFinalized {
        story_id: Option<String>,
        points: String,
    },
    RoleUpdated {
        participant_id: String,
        role: Role,
    },
    FacilitatorChanged {
        facilitator_id: String,
    },
    Error {
        message: String,
    },
    Pong,
}
