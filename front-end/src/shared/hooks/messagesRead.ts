const EVENT_NAME = 'messages:read';

export function notifyMessagesRead() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function onMessagesRead(handler: () => void): () => void {
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
