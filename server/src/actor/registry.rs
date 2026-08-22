use crate::actor::room_actor::{RoomActor, RoomCommand};
use crate::domain::protocol::ServerEvent;
use crate::domain::slug::{generate_short_code, generate_slug};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{broadcast, mpsc, RwLock};

#[derive(Clone)]
pub struct RoomHandle {
    pub slug: String,
    pub short_code: String,
    pub tx: mpsc::Sender<RoomCommand>,
    pub event_tx: broadcast::Sender<ServerEvent>,
}

#[derive(Clone, Default)]
pub struct RoomRegistry {
    rooms: Arc<RwLock<HashMap<String, RoomHandle>>>,
}

impl RoomRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    pub async fn create_room(&self) -> RoomHandle {
        let mut rooms = self.rooms.write().await;
        let mut slug = generate_slug();
        while rooms.contains_key(&slug) {
            slug = generate_slug();
        }

        let short_code = generate_short_code(&slug);
        let (tx, rx) = mpsc::channel(64);
        let (event_tx, _) = broadcast::channel(128);

        let actor = RoomActor::new(slug.clone(), short_code.clone(), event_tx.clone());
        tokio::spawn(actor.run(rx));

        let handle = RoomHandle {
            slug: slug.clone(),
            short_code: short_code.clone(),
            tx,
            event_tx,
        };

        rooms.insert(slug, handle.clone());
        handle
    }

    pub async fn get_or_create(&self, slug_or_code: &str) -> RoomHandle {
        let query_upper = slug_or_code.trim().to_ascii_uppercase();

        let rooms = self.rooms.read().await;
        if let Some(h) = rooms.get(&query_upper) {
            return h.clone();
        }
        drop(rooms);

        let mut rooms = self.rooms.write().await;
        if let Some(h) = rooms.get(&query_upper) {
            return h.clone();
        }

        let (tx, rx) = mpsc::channel(64);
        let (event_tx, _) = broadcast::channel(128);

        let actor = RoomActor::new(query_upper.clone(), query_upper.clone(), event_tx.clone());
        tokio::spawn(actor.run(rx));

        let handle = RoomHandle {
            slug: query_upper.clone(),
            short_code: query_upper.clone(),
            tx,
            event_tx,
        };

        rooms.insert(query_upper, handle.clone());
        handle
    }

    pub async fn find(&self, slug_or_code: &str) -> Option<RoomHandle> {
        let query_upper = slug_or_code.trim().to_ascii_uppercase();
        let rooms = self.rooms.read().await;
        rooms.get(&query_upper).cloned()
    }
}
