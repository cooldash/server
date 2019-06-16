export class PortConnector {
  connections = [];

  constructor(portManager) {
    this.portManager = portManager;
  }

  create(sourceID, consumerID) {
    const data = {
      sourceID,
      consumerID,
      disconnect: () => {
        this.disconnect(sourceID, consumerID);
      },
    };
    this.connections.push(data);
    return data;
  }

  getConnections(portID) {
    return this.connections
      .filter(item => item.sourceID === portID || item.consumerID === portID);
  }

  getConnectionsWithSource(portID) {
    return this.connections
      .filter(item => item.sourceID === portID);
  }

  getConnectionsWithConsumer(portID) {
    return this.connections
      .filter(item => item.consumerID === portID);
  }

  disconnect(sourceID, destID) {
    this.connections
      .filter(item => item.sourceID === sourceID && item.consumerID === destID)
      .forEach(item => {
        item.disconnect();
      });
  }
}
