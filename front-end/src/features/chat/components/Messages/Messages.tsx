import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChatWindow } from '../ChatWindow/ChatWindow';
import { startChatConnection, getChatConnection } from '../../../../core/signalr/chat';
import './Messages.scss';

interface Conversation {
  otherUserId: number;
  otherUserName: string;
  lastMessage: string;
  lastAt: string;
  unreadCount: number;
}

export function Messages() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const activeId = userId ? Number(userId) : null;

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const activeIdRef = useRef<number | null>(activeId);
  activeIdRef.current = activeId;

  const loadConversations = useCallback(() => {
    axios
      .get('https://localhost:7154/api/Messages/conversations')
      .then((res) => {
        const active = activeIdRef.current;
        setConversations(
          res.data.map((c: Conversation) =>
            c.otherUserId === active ? { ...c, unreadCount: 0 } : c
          )
        );
      })
      .catch(() => setConversations([]));
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeId == null) return;
    setConversations((prev) =>
      prev.map((c) => (c.otherUserId === activeId ? { ...c, unreadCount: 0 } : c))
    );
  }, [activeId]);

  useEffect(() => {
    let mounted = true;
    const handler = () => {
      if (mounted) loadConversations();
    };
    startChatConnection().then((conn) => {
      conn.on('ReceiveMessage', handler);
    });
    return () => {
      mounted = false;
      getChatConnection().off('ReceiveMessage', handler);
    };
  }, [loadConversations]);

  const activeConv = conversations.find((c) => c.otherUserId === activeId);

  return (
    <div className={`messages-page ${activeId ? 'has-active' : ''}`}>
      <aside className="conversation-list">
        <h2>Messages</h2>
        {conversations.length === 0 ? (
          <div className="conv-empty">No conversations.</div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.otherUserId}
              className={`conv-item ${c.otherUserId === activeId ? 'active' : ''}`}
              onClick={() => navigate(`/messages/${c.otherUserId}`)}
            >
              <div className="conv-top">
                <span className="conv-name">{c.otherUserName}</span>
                {c.unreadCount > 0 && <span className="conv-unread">{c.unreadCount}</span>}
              </div>
              <span className="conv-last">{c.lastMessage}</span>
            </button>
          ))
        )}
      </aside>

      <section className="conversation-view">
        {activeId ? (
          <ChatWindow
            otherUserId={activeId}
            otherUserName={activeConv?.otherUserName}
            onMessageSent={loadConversations}
          />
        ) : (
          <div className="conv-placeholder">Select a conversation</div>
        )}
      </section>
    </div>
  );
}
