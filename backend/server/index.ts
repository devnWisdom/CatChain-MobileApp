import http from 'http';

import { createSignalingServer } from '../services/webrtcService';
import { createApp } from './app';

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();
const server = http.createServer(app);

// Attach Socket.IO signaling server for WebRTC telemedicine consultations
createSignalingServer(server);

server.listen(PORT, () => {
  console.warn(`PetChain REST API listening on http://localhost:${PORT}/api`);
  console.warn(`Health check: http://localhost:${PORT}/api/health`);
  console.warn(`Signaling:    ws://localhost:${PORT}/signaling`);
});
