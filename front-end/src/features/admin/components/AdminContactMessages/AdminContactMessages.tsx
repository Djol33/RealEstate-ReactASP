import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Pagination } from '../../../../shared/components/Pagination/Pagination';
import { API_URL } from '../../../../config';
import './AdminContactMessages.scss';
import { useToast } from '../../../../shared/components/Toast/ToastProvider';

interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  reasonName: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  replyText: string | null;
  repliedAt: string | null;
  repliedByEmail: string | null;
  closedAt: string | null;
  isHandled: boolean;
}

interface Reason {
  id: number;
  name: string;
}

export function AdminContactMessages() {
  const toast = useToast();
  const [tab, setTab] = useState<'inbox' | 'history'>('inbox');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [reasonId, setReasonId] = useState('');

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [tab, debouncedSearch, reasonId]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/contact/reasons`)
      .then((res) => setReasons(res.data))
      .catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/contact-messages`, {
        params: {
          handled: tab === 'history',
          search: debouncedSearch || undefined,
          reasonId: reasonId ? Number(reasonId) : undefined,
          page,
        },
      })
      .then((res) => {
        setError('');
        setMessages(res.data.data ?? []);
        setTotalPages(res.data.totalPages ?? 1);
        setTotalCount(res.data.totalCount ?? 0);
      })
      .catch(() => setError('Failed to load messages.'))
      .finally(() => setLoading(false));
  }, [tab, debouncedSearch, reasonId, page]);

  useEffect(() => {
    load();
  }, [load]);

  function switchTab(next: 'inbox' | 'history') {
    setTab(next);
    setExpandedId(null);
    setReplyText('');
    setReplyError('');
  }

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
      setReplyText('');
      setExpandedId(null);
      load();
    } catch (err: any) {
      const first = err.response?.data?.errors?.[0];
      setReplyError(first?.error ?? 'Could not send reply. Please try again.');
    } finally {
      setSending(false);
    }
  }

  async function closeMessage(m: ContactMessage) {
    setBusyId(m.id);
    try {
      await axios.post(`${API_URL}/api/admin/contact-messages/${m.id}/close`);
      setExpandedId(null);
      load();
    } catch (err: any) {
      const first = err.response?.data?.errors?.[0];
      toast.error(first?.error ?? 'Could not close the message.');
    } finally {
      setBusyId(null);
    }
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="admin-contact-messages">
      <h1>
        Contact messages
        {tab === 'inbox' && unreadCount > 0 ? ` (${unreadCount} unread)` : ''}
      </h1>

      <div className="messages-tabs">
        <button
          type="button"
          className={tab === 'inbox' ? 'active' : ''}
          onClick={() => switchTab('inbox')}
        >
          Inbox
        </button>
        <button
          type="button"
          className={tab === 'history' ? 'active' : ''}
          onClick={() => switchTab('history')}
        >
          History
        </button>
      </div>

      <div className="messages-filters">
        <input
          type="search"
          placeholder="Search name, email or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={reasonId} onChange={(e) => setReasonId(e.target.value)}>
          <option value="">All reasons</option>
          {reasons.map((r) => (
            <option key={r.id} value={String(r.id)}>{r.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="messages-list">
          {messages.length === 0 && (
            <p className="empty">
              {tab === 'inbox' ? 'No open messages.' : 'No handled messages yet.'}
            </p>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`message-row ${!m.isRead && tab === 'inbox' ? 'unread' : ''}`}>
              <button type="button" className="message-summary" onClick={() => toggleExpand(m)}>
                {!m.isRead && tab === 'inbox' && <span className="unread-dot" />}
                <span className="summary-name">{m.firstName} {m.lastName}</span>
                <span className="summary-reason">{m.reasonName}</span>
                {tab === 'history' && (
                  <span className={`summary-status ${m.repliedAt ? 'replied' : 'closed'}`}>
                    {m.repliedAt ? 'Replied' : 'Closed'}
                  </span>
                )}
                <span className="summary-date">{new Date(m.createdAt).toLocaleDateString()}</span>
                <i className={`fa-solid fa-chevron-${expandedId === m.id ? 'up' : 'down'}`} />
              </button>

              {expandedId === m.id && (
                <div className="message-detail">
                  <p><strong>Email:</strong> <a href={`mailto:${m.email}`}>{m.email}</a></p>
                  <p className="message-content">{m.message}</p>

                  {m.isHandled ? (
                    <div className="reply-history">
                      {m.repliedAt ? (
                        <>
                          <div className="reply-history-header">
                            Replied {new Date(m.repliedAt).toLocaleString()}
                            {m.repliedByEmail ? ` by ${m.repliedByEmail}` : ''}
                          </div>
                          <p className="reply-history-text">{m.replyText}</p>
                        </>
                      ) : (
                        <div className="reply-history-header">
                          Closed without reply
                          {m.closedAt ? ` on ${new Date(m.closedAt).toLocaleString()}` : ''}
                          {m.repliedByEmail ? ` by ${m.repliedByEmail}` : ''}
                        </div>
                      )}
                    </div>
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
                      <div className="reply-actions">
                        <button
                          type="button"
                          className="btn-reply"
                          onClick={() => sendReply(m)}
                          disabled={sending || busyId === m.id}
                        >
                          {sending ? 'Sending...' : 'Send reply'}
                        </button>
                        <button
                          type="button"
                          className="btn-close-msg"
                          onClick={() => closeMessage(m)}
                          disabled={sending || busyId === m.id}
                        >
                          Close without reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && totalCount > 0 && (
        <div className="admin-pagination">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
