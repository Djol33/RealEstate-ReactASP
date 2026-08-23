import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { startChatConnection, getChatConnection } from '../../../../core/signalr/chat';
import { API_URL } from '../../../../config';
import { notifyMessagesRead } from '../../../../shared/hooks/messagesRead';
import './ChatWindow.scss';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface ChatWindowProps {
  otherUserId: number;
  otherUserName?: string;
  onMessageSent?: () => void;
}

export function ChatWindow({ otherUserId, otherUserName, onMessageSent }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const myId = JSON.parse(localStorage.getItem('user') || '{}').id;

  function loadMessages() {
    setLoadError(false);
    axios
      .get(`${API_URL}/api/Messages/${otherUserId}`)
      .then((res) => {
        setMessages(res.data);
        notifyMessagesRead();
      })
      .catch(() => setLoadError(true));
  }

  useEffect(() => {
    loadMessages();
  }, [otherUserId]);

  useEffect(() => {
    let mounted = true;

    const handler = (msg: Message) => {
      if (!mounted) return;
      if (msg.senderId === otherUserId || msg.receiverId === otherUserId) {
        setMessages((prev) => [...prev, msg]);
        if (msg.senderId === otherUserId) {
          axios
            .get(`${API_URL}/api/Messages/${otherUserId}`)
            .then(() => notifyMessagesRead())
            .catch(() => {});
        }
      }
    };

    startChatConnection().then((conn) => {
      conn.on('ReceiveMessage', handler);
    });

    return () => {
      mounted = false;
      getChatConnection().off('ReceiveMessage', handler);
    };
  }, [otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content || sending) return;

    setSending(true);
    try {
      const conn = await startChatConnection();
      await conn.invoke('SendMessage', otherUserId, content);
      setText('');
      onMessageSent?.();
    } catch {
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header">{otherUserName ?? 'Conversation'}</div>

      <div className="chat-messages">
        {loadError ? (
          <div className="chat-empty chat-error">
            Could not load messages.{' '}
            <button type="button" className="chat-retry" onClick={loadMessages}>
              Try again
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">No messages yet. Start the conversation.</div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`chat-bubble ${m.senderId === myId ? 'mine' : 'theirs'}`}
            >
              <span className="chat-text">{m.content}</span>
              <span className="chat-time">
                {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input" onSubmit={send}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
        />
        <button type="submit" disabled={sending || !text.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
