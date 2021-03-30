import io from 'socket.io-client';

const serverUrl = 'https://simple-multiplayer-server.glitch.me';

class Network {
  init(color, updateSelfId, handleStateUpdate) {
    this.socket = io.connect(serverUrl);
    this.socket.on('connect', () => {
      updateSelfId(this.socket.id);

      // register for state updates from the server
      this.socket.on('stateUpdate', handleStateUpdate);

      // tell server to create the player with a color
      this.socket.emit('initialize', { color: color });
    });
  }
  sendPosition(positionData) {
    this.socket.emit('positionUpdate', positionData);
  }
}

const network = new Network();

export default network;
