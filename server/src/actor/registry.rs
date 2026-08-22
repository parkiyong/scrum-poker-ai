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
    rooms_by_slug: Arc<RwLock<HashMap<String, RoomHandle>>>,
    rooms_by_code: Arc<RwLock<HashMap<String, RoomHandle>>>,
}

impl RoomRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    pub async fn create_room(&self) -> RoomHandle {
        let mut slug = generate_slug();
        let mut short_code = generate_short_code(&slug);

        let mut by_slug = self.rooms_by_slug.write().await;
        let mut by_code = self.rooms_by_code.write().await;

        while by_slug.contains_key(&slug) {
            slug = generate_slug();
            short_code = generate_short_code(&slug);
        }

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

        by_slug.insert(slug.clone(), handle.clone());
        by_code.insert(short_code.clone(), handle.clone());

        handle
    }

    pub async fn get_or_create(&self, slug_or_code: &str) -> RoomHandle {
        let query = slug_or_code.trim();
        let query_upper = query.to_ascii_uppercase();

        let by_slug = self.rooms_by_slug.read().await;
        if let Some(h) = by_slug.get(query) {
            return h.clone();
        }
        drop(by_slug);

        let by_code = self.rooms_by_code.read().await;
        if let Some(h) = by_code.get(&query_upper) {
            return h.clone();
        }
        drop(by_code);

        // If not found, create new room with this slug
        let mut by_slug = self.rooms_by_slug.write().await;
        let mut by_code = self.rooms_by_code.write().await;

        // Double check
        if let Some(h) = by_slug.get(query) {
            return h.clone();
        }

        let short_code = generate_short_code(query);
        let (tx, rx) = mpsc::channel(64);
        let (event_tx, _) = broadcast::channel(128);

        let actor = RoomActor::new(query.to_string(), short_code.clone(), event_tx.clone());
        tokio::spawn(actor.run(rx));

        let handle = RoomHandle {
            slug: query.to_string(),
            short_code: short_code.clone(),
            tx,
            event_tx,
        };

        by_slug.insert(query.to_string(), handle.clone());
        by_code.insert(short_code, handle.clone());

        handle
    }

    pub async fn find(&self, slug_or_code: &str) -> Option<RoomHandle> {
        let query = slug_or_code.trim();
        let query_upper = query.to_ascii_uppercase();

        let by_slug = self.rooms_by_slug.read().await;
        if let Some(h) = by_slug.get(query) {
            return Some(h.clone());
        }
        drop(by_slug);

        let by_code = self.rooms_by_code.read().await;
        if let Some(h) = by_code.get(&query_upper) {
            return Some(h.clone());
        }

        None
    }
}
