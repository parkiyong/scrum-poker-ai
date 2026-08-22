use server::actor::room_actor::{RoomActor, RoomCommand};
use server::domain::models::{EstimationPhase, Role, Story};
use server::domain::protocol::ClientCommand;
use tokio::sync::mpsc;

#[tokio::test]
async fn test_room_lifecycle_and_state_machine() {
    let (tx, rx) = mpsc::channel(32);
    let (event_tx, _event_rx) = tokio::sync::broadcast::channel(32);
    let actor = RoomActor::new("swift-badger-42".to_string(), "SWB-42".to_string(), event_tx);
    tokio::spawn(actor.run(rx));

    // 1. First participant joins (Facilitator)
    let (reply_tx, reply_rx) = tokio::sync::oneshot::channel();
    tx.send(RoomCommand::ClientMsg {
        participant_id: "p1".to_string(),
        command: ClientCommand::JoinRoom {
            participant_id: "p1".to_string(),
            nickname: "Alex".to_string(),
            avatar: "indigo".to_string(),
            role: None, // First joiner should become Facilitator
        },
        reply: Some(reply_tx),
    })
    .await
    .unwrap();

    let res = reply_rx.await.unwrap().unwrap();
    assert_eq!(res.role, Role::Facilitator);

    // 2. Second participant joins (Estimator)
    let (reply_tx2, reply_rx2) = tokio::sync::oneshot::channel();
    tx.send(RoomCommand::ClientMsg {
        participant_id: "p2".to_string(),
        command: ClientCommand::JoinRoom {
            participant_id: "p2".to_string(),
            nickname: "Sarah".to_string(),
            avatar: "emerald".to_string(),
            role: None, // Second joiner becomes Estimator
        },
        reply: Some(reply_tx2),
    })
    .await
    .unwrap();

    let res2 = reply_rx2.await.unwrap().unwrap();
    assert_eq!(res2.role, Role::Estimator);

    // 3. Facilitator selects story & starts voting
    tx.send(RoomCommand::ClientMsg {
        participant_id: "p1".to_string(),
        command: ClientCommand::SelectStory {
            story: Some(Story {
                id: "s1".to_string(),
                title: "Test story".to_string(),
                description: "Description".to_string(),
                acceptance_criteria: vec!["AC1".to_string()],
            }),
        },
        reply: None,
    })
    .await
    .unwrap();

    tx.send(RoomCommand::ClientMsg {
        participant_id: "p1".to_string(),
        command: ClientCommand::StartVoting,
        reply: None,
    })
    .await
    .unwrap();

    // 4. Participants cast votes
    tx.send(RoomCommand::ClientMsg {
        participant_id: "p1".to_string(),
        command: ClientCommand::CastVote {
            value: "5".to_string(),
        },
        reply: None,
    })
    .await
    .unwrap();

    tx.send(RoomCommand::ClientMsg {
        participant_id: "p2".to_string(),
        command: ClientCommand::CastVote {
            value: "5".to_string(),
        },
        reply: None,
    })
    .await
    .unwrap();

    // 5. Facilitator reveals cards
    tx.send(RoomCommand::ClientMsg {
        participant_id: "p1".to_string(),
        command: ClientCommand::RevealCards,
        reply: None,
    })
    .await
    .unwrap();

    // Check state snapshot query
    let (snap_tx, snap_rx) = tokio::sync::oneshot::channel();
    tx.send(RoomCommand::GetSnapshot {
        participant_id: "p1".to_string(),
        reply: snap_tx,
    })
    .await
    .unwrap();

    let snapshot = snap_rx.await.unwrap();
    assert_eq!(snapshot.phase, EstimationPhase::Revealed);
    assert_eq!(snapshot.participants.len(), 2);
    let p1_proj = snapshot.participants.iter().find(|p| p.id == "p1").unwrap();
    assert_eq!(p1_proj.vote, Some("5".to_string()));
}

#[tokio::test]
async fn test_reconnect_preserves_vote_and_identity() {
    let (tx, rx) = mpsc::channel(32);
    let (event_tx, _event_rx) = tokio::sync::broadcast::channel(32);
    let actor = RoomActor::new("swift-badger-42".to_string(), "SWB-42".to_string(), event_tx);
    tokio::spawn(actor.run(rx));

    // Join & vote
    let (reply_tx, reply_rx) = tokio::sync::oneshot::channel();
    tx.send(RoomCommand::ClientMsg {
        participant_id: "user-123".to_string(),
        command: ClientCommand::JoinRoom {
            participant_id: "user-123".to_string(),
            nickname: "Alex".to_string(),
            avatar: "indigo".to_string(),
            role: None,
        },
        reply: Some(reply_tx),
    })
    .await
    .unwrap();
    let _ = reply_rx.await.unwrap();

    tx.send(RoomCommand::ClientMsg {
        participant_id: "user-123".to_string(),
        command: ClientCommand::StartVoting,
        reply: None,
    })
    .await
    .unwrap();

    tx.send(RoomCommand::ClientMsg {
        participant_id: "user-123".to_string(),
        command: ClientCommand::CastVote {
            value: "8".to_string(),
        },
        reply: None,
    })
    .await
    .unwrap();

    // Simulate disconnect
    tx.send(RoomCommand::Disconnect {
        participant_id: "user-123".to_string(),
    })
    .await
    .unwrap();

    // Reconnect with same participant_id
    let (reconnect_tx, reconnect_rx) = tokio::sync::oneshot::channel();
    tx.send(RoomCommand::ClientMsg {
        participant_id: "user-123".to_string(),
        command: ClientCommand::JoinRoom {
            participant_id: "user-123".to_string(),
            nickname: "Alex".to_string(),
            avatar: "indigo".to_string(),
            role: None,
        },
        reply: Some(reconnect_tx),
    })
    .await
    .unwrap();

    let reconnect_res = reconnect_rx.await.unwrap().unwrap();
    assert_eq!(reconnect_res.nickname, "Alex");

    // Snapshot should still show vote recorded
    let (snap_tx, snap_rx) = tokio::sync::oneshot::channel();
    tx.send(RoomCommand::GetSnapshot {
        participant_id: "user-123".to_string(),
        reply: snap_tx,
    })
    .await
    .unwrap();

    let snap = snap_rx.await.unwrap();
    let p = snap.participants.iter().find(|p| p.id == "user-123").unwrap();
    assert_eq!(p.voted, true);
    assert_eq!(p.vote, Some("8".to_string())); // Self vote visible
}

#[tokio::test]
async fn test_facilitator_failover_promotion() {
    let (tx, rx) = mpsc::channel(32);
    let (event_tx, _event_rx) = tokio::sync::broadcast::channel(32);
    let actor = RoomActor::new("swift-badger-42".to_string(), "SWB-42".to_string(), event_tx);
    tokio::spawn(actor.run(rx));

    // Facilitator joins
    let (tx1, rx1) = tokio::sync::oneshot::channel();
    tx.send(RoomCommand::ClientMsg {
        participant_id: "fac-1".to_string(),
        command: ClientCommand::JoinRoom {
            participant_id: "fac-1".to_string(),
            nickname: "Original Facilitator".to_string(),
            avatar: "indigo".to_string(),
            role: None,
        },
        reply: Some(tx1),
    })
    .await
    .unwrap();
    let _ = rx1.await.unwrap();

    // Estimator joins
    let (tx2, rx2) = tokio::sync::oneshot::channel();
    tx.send(RoomCommand::ClientMsg {
        participant_id: "est-2".to_string(),
        command: ClientCommand::JoinRoom {
            participant_id: "est-2".to_string(),
            nickname: "Second Estimator".to_string(),
            avatar: "emerald".to_string(),
            role: None,
        },
        reply: Some(tx2),
    })
    .await
    .unwrap();
    let _ = rx2.await.unwrap();

    // Facilitator disconnects
    tx.send(RoomCommand::Disconnect {
        participant_id: "fac-1".to_string(),
    })
    .await
    .unwrap();

    // Check snapshot
    let (snap_tx, snap_rx) = tokio::sync::oneshot::channel();
    tx.send(RoomCommand::GetSnapshot {
        participant_id: "est-2".to_string(),
        reply: snap_tx,
    })
    .await
    .unwrap();

    let snap = snap_rx.await.unwrap();
    assert_eq!(snap.facilitator_id, "est-2");
    let p = snap.participants.iter().find(|p| p.id == "est-2").unwrap();
    assert_eq!(p.role, Role::Facilitator);
}
