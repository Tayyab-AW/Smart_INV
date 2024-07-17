const mqtt = require('mqtt');
const parseInverterResponse = require('../utils/parseInverterResponse');

const client = mqtt.connect('ws://localhost:9001');

let commandResponseResolver;

let inverterData = {};

// Subscribe to the topic to receive messages from ESP32
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('inverter/response', (err) => {
    if (!err) {
      console.log('Subscribed to inverter/response topic');
    }
  });

  client.subscribe('inverter/command/received', (err) => {
    if (!err) {
      console.log('Subscribed to inverter/command/received topic');
    }
  });
});

client.on('message', (topic, message) => {
  if (topic === 'inverter/response') {
    try {
      const messageStr = message.toString();
      const [command, response] = messageStr.split(';');
      const cleanedResponse = response.replace(/[{()}]/g, '');
      const parsedResponse = parseInverterResponse(command, cleanedResponse);
      inverterData = { command, ...parsedResponse };
      console.log('Parsed Response:', inverterData);

      if (commandResponseResolver) {
        commandResponseResolver(inverterData);
        commandResponseResolver = null;
      }
    } catch (err) {
      console.error('Error processing inverter response:', err);
      if (commandResponseResolver) {
        commandResponseResolver({ error: 'Failed to process inverter response' });
        commandResponseResolver = null;
      }
    }
  }
});

function sendCommandToInverter(command) {
  return new Promise((resolve, reject) => {
    commandResponseResolver = resolve;
    client.publish('inverter/command', command, (err) => {
      if (err) {
        console.error('MQTT publish error:', err);
        reject(err);
      } else {
        console.log(`Command sent to inverter: ${command}`);
      }
    });
  });
}

module.exports = {
  sendCommandToInverter,
};
