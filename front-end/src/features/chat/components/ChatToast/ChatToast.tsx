import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../../AuthStore';
import { startChatConnection, stopChatConnection, getChatConnection } from '../../../../core/signalr/chat';
import { API_URL } from '../../../../config';
import './ChatToast.scss';

interface IncomingMessage {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
}

interface Toast {
  senderId: number;
  senderName: string;
  content: string;
}

export function ChatToast() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [toast, setToast] = useState<Toast | null>(null);
  const hideTimer = useRef<number | null>(null);
  const nameCache = useRef<Record<number, string>>({});

  const locationRef = useRef(location.pathname);
  locationRef.current = location.pathname;

  const myId = user?.id;

  useEffect(() => {
    if (!user) {
      stopChatConnection();
      return;
    }

    let mounted = true;

    async function resolveName(senderId: number): Promise<string> {
      if (nameCache.current[senderId]) return nameCache.current[senderId];
      try {
        const res = await axios.get(`${API_URL}/api/Profile/${senderId}`);
        const b = res.data?.userBasic;
        const name = b ? `${b.firstName} ${b.lastName}` : 'Korisnik';
        nameCache.current[senderId] = name;
        return name;
      } catch {
        return 'Korisnik';
      }
    }

    const handler = async (msg: IncomingMessage) => {
      if (!mounted) return;
      if (msg.senderId === myId) return;

      const path = locationRef.current;
      if (path.startsWith('/messages')) return;

      const senderName = await resolveName(msg.senderId);
      setToast({ senderId: msg.senderId, senderName, content: msg.content });

      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setToast(null), 5000);
    };

    startChatConnection().then((conn) => {
      conn.on('ReceiveMessage', handler);
    });

    return () => {
      mounted = false;
      getChatConnection().off('ReceiveMessage', handler);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [user, myId]);

  if (!toast) return null;

  return (
    <div
      className="chat-toast"
      onClick={() => {
        navigate(`/messages/${toast.senderId}`);
        setToast(null);
      }}
    >
      <div className="chat-toast-icon">
        <i className="fa-solid fa-envelope" />
      </div>
      <div className="chat-toast-body">
        <div className="chat-toast-name">{toast.senderName}</div>
        <div className="chat-toast-text">{toast.content}</div>
      </div>
      <button
        type="button"
        className="chat-toast-close"
        onClick={(e) => {
          e.stopPropagation();
          setToast(null);
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
