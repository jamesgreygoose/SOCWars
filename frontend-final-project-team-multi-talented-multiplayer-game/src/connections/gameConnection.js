// Socket.io is imported, connected to the game server, and exported for use within the app.

import io from 'socket.io-client';

const url = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const connection = io(`${url}/game`);

console.log(`Connecting on ${url}.`);

export default connection;
