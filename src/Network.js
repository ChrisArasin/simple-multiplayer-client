import io from 'socket.io-client';

const serverUrl = 'https://simple-multiplayer-server.glitch.me';

class Network {
  constructor() {
    this.socket = io.connect(serverUrl);
  }
  init(color, handlePlayerInitData, handleStateUpdate) {
    this.socket.on('playerData', handlePlayerInitData);
    this.socket.on('stateUpdate', handleStateUpdate);
    this.socket.emit('initialize', { color: color });
  }
  sendPosition(positionData) {
    this.socket.emit('positionUpdate', positionData);
  }
}

const network = new Network();

export default network;
