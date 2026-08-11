import * as signalR from '@microsoft/signalr';
import { API_URL } from '../../config';

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<signalR.HubConnection> | null = null;

export type ChatConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

let status: ChatConnectionStatus = 'disconnected';
const statusListeners = new Set<(status: ChatConnectionStatus) => void>();

function setStatus(next: ChatConnectionStatus) {
  status = next;
  statusListeners.forEach((listener) => listener(status));
}

export function getChatStatus(): ChatConnectionStatus {
  return status;
}

export function subscribeChatStatus(listener: (status: ChatConnectionStatus) => void): () => void {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

function getToken(): string | null {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored).token : null;
}

export function getChatConnection(): signalR.HubConnection {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_URL}/hubs/chat`, {
      accessTokenFactory: () => getToken() ?? '',
    })
    .withAutomaticReconnect()
    .build();

  connection.onreconnecting(() => setStatus('reconnecting'));
  connection.onreconnected(() => setStatus('connected'));
  connection.onclose(() => setStatus('disconnected'));

  return connection;
}

export function startChatConnection(): Promise<signalR.HubConnection> {
  const conn = getChatConnection();

  if (conn.state === signalR.HubConnectionState.Connected) {
    return Promise.resolve(conn);
  }

  if (!startPromise) {
    startPromise = conn
      .start()
      .then(() => {
        setStatus('connected');
        return conn;
      })
      .catch((err) => {
        startPromise = null;
        setStatus('disconnected');
        throw err;
      });
  }

  return startPromise;
}

export async function stopChatConnection(): Promise<void> {
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
    await connection.stop();
  }
  connection = null;
  startPromise = null;
  setStatus('disconnected');
}
