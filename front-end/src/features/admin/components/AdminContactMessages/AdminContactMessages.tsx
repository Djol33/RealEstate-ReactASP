import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config';
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
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySentId, setReplySentId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/contact-messages`)
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
    setReplyText('');
    setReplyError('');
    if (opening && !m.isRead) {
      try {
        await axios.post(`${API_URL}/api/admin/contact-messages/${m.id}/read`);
        setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, isRead: true } : x)));
      } catch {
      }
    }
  }

  async function sendReply(m: ContactMessage) {
    const reply = replyText.trim();
    if (!reply) {
      setReplyError('Reply cannot be empty.');
      return;
    }
    setSending(true);
    setReplyError('');
    try {
      await axios.post(`${API_URL}/api/admin/contact-messages/${m.id}/reply`, { reply });
      setReplySentId(m.id);
      setReplyText('');
    } catch (err: any) {
      const first = err.response?.data?.errors?.[0];
      setReplyError(first?.error ?? 'Could not send reply. Please try again.');
    } finally {
      setSending(false);
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

                {replySentId === m.id ? (
                  <p className="reply-sent">
                    <i className="fa-solid fa-check" /> Reply sent.
                  </p>
                ) : (
                  <div className="reply-form">
                    <label htmlFor={`reply-${m.id}`}>Reply</label>
                    <textarea
                      id={`reply-${m.id}`}
                      rows={3}
                      maxLength={2000}
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    {replyError && <span className="reply-error">{replyError}</span>}
                    <button
                      type="button"
                      className="btn-reply"
                      onClick={() => sendReply(m)}
                      disabled={sending}
                    >
                      {sending ? 'Sending...' : 'Send reply'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
