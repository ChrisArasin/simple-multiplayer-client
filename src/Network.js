import io from 'socket.io-client';

class Network {
  init(serverUrl, color, updateSelfId, handleStateUpdate) {
    this.socket = io.connect(serverUrl);
    this.socket.on('connect', () => {
      // Get self ID from the connected socket and store
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
