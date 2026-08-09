import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminContactMessages.scss';

interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  reasonName: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get('https://localhost:7154/api/admin/contact-messages')
      .then((res) => setMessages(res.data))
      .catch(() => setError('Failed to load messages.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleExpand(m: ContactMessage) {
    const opening = expandedId !== m.id;
    setExpandedId(opening ? m.id : null);
    if (opening && !m.isRead) {
      try {
        await axios.post(`https://localhost:7154/api/admin/contact-messages/${m.id}/read`);
        setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, isRead: true } : x)));
      } catch {
        // ignore
      }
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="admin-contact-messages">
      <h1>Contact messages ({messages.length}{unreadCount > 0 ? `, ${unreadCount} unread` : ''})</h1>

      <div className="messages-list">
        {messages.length === 0 && <p className="empty">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`message-row ${!m.isRead ? 'unread' : ''}`}>
            <button type="button" className="message-summary" onClick={() => toggleExpand(m)}>
              {!m.isRead && <span className="unread-dot" />}
              <span className="summary-name">{m.firstName} {m.lastName}</span>
              <span className="summary-reason">{m.reasonName}</span>
              <span className="summary-date">{new Date(m.createdAt).toLocaleDateString()}</span>
              <i className={`fa-solid fa-chevron-${expandedId === m.id ? 'up' : 'down'}`} />
            </button>
            {expandedId === m.id && (
              <div className="message-detail">
                <p><strong>Email:</strong> <a href={`mailto:${m.email}`}>{m.email}</a></p>
                <p className="message-content">{m.message}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
