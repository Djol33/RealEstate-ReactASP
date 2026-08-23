import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './Toast.scss';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastApi {
  notify: (message: string, kind?: ToastKind) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef<Record<number, number>>({});

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    window.clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const notify = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, kind, message }]);
    timers.current[id] = window.setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach((x) => window.clearTimeout(x));
  }, []);

  const api: ToastApi = {
    notify,
    success: useCallback((m: string) => notify(m, 'success'), [notify]),
    error: useCallback((m: string) => notify(m, 'error'), [notify]),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.kind}`}>
            <i className={`fa-solid ${
              t.kind === 'success' ? 'fa-circle-check'
                : t.kind === 'error' ? 'fa-circle-exclamation'
                : 'fa-circle-info'
            }`} />
            <span className="toast-text">{t.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
