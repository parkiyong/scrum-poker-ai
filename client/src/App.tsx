import { useState, useEffect } from 'react';
import { LobbyView } from './views/LobbyView';
import { RoomView } from './views/RoomView';

export function App() {
  const [currentSlug, setCurrentSlug] = useState<string | null>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/r/')) {
      return path.replace('/r/', '').trim().toUpperCase();
    }
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) return roomParam.trim().toUpperCase();
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/r/')) {
        setCurrentSlug(path.replace('/r/', '').trim().toUpperCase());
      } else {
        const params = new URLSearchParams(window.location.search);
        const roomParam = params.get('room');
        setCurrentSlug(roomParam ? roomParam.trim().toUpperCase() : null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToRoom = (slug: string) => {
    const cleanSlug = slug.trim().toUpperCase();
    window.history.pushState({}, '', `/r/${cleanSlug}`);
    setCurrentSlug(cleanSlug);
  };

  const handleCreateRoom = async (customSlug?: string) => {
    setLoading(true);
    try {
      if (customSlug) {
        navigateToRoom(customSlug);
      } else {
        const res = await fetch('/api/rooms', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          navigateToRoom(data.slug);
        } else {
          const randomSlug = `SWB-${Math.floor(Math.random() * 90 + 10)}`;
          navigateToRoom(randomSlug);
        }
      }
    } catch {
      const randomSlug = `SWB-${Math.floor(Math.random() * 90 + 10)}`;
      navigateToRoom(randomSlug);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = () => {
    window.history.pushState({}, '', '/');
    setCurrentSlug(null);
  };

  if (currentSlug) {
    return <RoomView slug={currentSlug} onLeave={handleLeaveRoom} />;
  }

  return (
    <LobbyView
      onJoinRoom={navigateToRoom}
      onCreateRoom={handleCreateRoom}
      loading={loading}
    />
  );
}

export default App;
