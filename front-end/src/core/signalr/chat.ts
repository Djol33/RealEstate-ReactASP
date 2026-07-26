import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<signalR.HubConnection> | null = null;

function getToken(): string | null {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored).token : null;
}

export function getChatConnection(): signalR.HubConnection {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7154/hubs/chat', {
      accessTokenFactory: () => getToken() ?? '',
    })
    .withAutomaticReconnect()
    .build();

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
      .then(() => conn)
      .catch((err) => {
        startPromise = null;
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
}
