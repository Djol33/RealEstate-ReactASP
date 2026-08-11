import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthStore';
import { startChatConnection, getChatConnection } from '../../core/signalr/chat';
import { API_URL } from '../../config';

interface Conversation {
  unreadCount: number;
}

export function useUnreadMessages(): number {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  function load() {
    axios
      .get(`${API_URL}/api/Messages/conversations`)
      .then((res) => {
        const total = (res.data as Conversation[]).reduce((sum, c) => sum + c.unreadCount, 0);
        setUnreadCount(total);
      })
      .catch(() => {});
  }

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    load();
  }, [location.pathname, user]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const handler = () => {
      if (mounted) load();
    };
    startChatConnection().then((conn) => {
      conn.on('ReceiveMessage', handler);
    });
    return () => {
      mounted = false;
      getChatConnection().off('ReceiveMessage', handler);
    };
  }, [user]);

  return unreadCount;
}
