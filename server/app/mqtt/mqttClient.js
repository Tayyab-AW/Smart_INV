const mqtt = require('mqtt');
const parseInverterResponse = require('../utils/parseInverterResponse');
const { v4: uuidv4 } = require('uuid');
const Device = require("../models/deviceModel");

const client = mqtt.connect('mqtt://192.168.0.181:1883');

let commandResponseResolver;

let inverterData = {};

const deviceTimeouts = new Map();
const TIMEOUT_DURATION = 5000; // 10 seconds for demo purposes, adjust as needed


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

client.on('message', async (topic, message) => {
  const messageStr = message.toString(); 
  if (topic === 'inverter/response') {
    try {
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
  }else if (topic === 'inverter/keepalive/Q0023042086904') {
    console.log(messageStr)
    try {
      const serialNumber = messageStr;
       // Clear the previous timeout for the device, if it exists
  if (deviceTimeouts.has(serialNumber)) {
    clearTimeout(deviceTimeouts.get(serialNumber));
  }

  // Set a new timeout for the device
  const timeoutId = setTimeout(async () => {
    await Device.findOneAndUpdate({ serialNumber }, { online: false });
    deviceTimeouts.delete(serialNumber);
  }, TIMEOUT_DURATION);

  // Store the new timeout ID
  deviceTimeouts.set(serialNumber, timeoutId);
      const device = await Device.findOne({ serialNumber });
      if (device) {
        device.online = true;
        device.lastSeen = new Date();
        await device.save();
      }
    } catch (err) {
      console.error('Error processing keepalive message:', err);
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

// client.on('message', async (topic, message) => {
//   const messageStr = message.toString();
//   if (topic.startsWith('inverter/response/')) {
//     try {
//       const [_, serialNumber, uuid] = topic.split('/');
//       const cleanedResponse = messageStr.replace(/[{()}]/g, '');
//       const parsedResponse = parseInverterResponse(cleanedResponse);

//       if (pendingCommands[uuid]) {
//         pendingCommands[uuid].resolve({ serialNumber, command: pendingCommands[uuid].command, ...parsedResponse });
//         delete pendingCommands[uuid];
//       }

//       // Save data to the database
//       if (serialNumber) {
//         const device = await Device.findOne({ serialNumber });
//         if (device) {
//           device.data[pendingCommands[uuid].command] = parsedResponse;
//           await device.save();
//         }
//       }
//     } catch (err) {
//       console.error('Error processing inverter response:', err);
//       if (pendingCommands[uuid]) {
//         pendingCommands[uuid].reject('Failed to process inverter response');
//         delete pendingCommands[uuid];
//       }
//     }
//   } else if (topic === 'inverter/keepalive') {
//     try {
//       const serialNumber = messageStr;
//       const device = await Device.findOne({ serialNumber });
//       if (device) {
//         device.online = true;
//         device.lastSeen = new Date();
//         await device.save();
//       }
//     } catch (err) {
//       console.error('Error processing keepalive message:', err);
//     }
//   }
// });

// function sendCommandToInverter(serialNumber, command) {
//   const uuid = uuidv4();
//   const topic = `inverter/command/${serialNumber}`;
//   const payload = { uuid, command };
//   return new Promise((resolve, reject) => {
//     pendingCommands[uuid] = { command, resolve, reject };
//     client.publish(topic, JSON.stringify(payload), (err) => {
//       if (err) {
//         console.error('MQTT publish error:', err);
//         reject(err);
//       } else {
//         console.log(`Command sent to inverter: ${topic} - ${command}`);
//       }
//     });
//   });
// }


// Function to subscribe to a device-specific topic
function subscribeToDevice(serialNumber) {
  const topic = `inverter/response/${serialNumber}`;
  client.subscribe(topic, (err) => {
    if (err) {
      console.error(`Failed to subscribe to topic ${topic}:`, err);
    } else {
      console.log(`Subscribed to topic ${topic}`);
    }
  });
  const topic1 = `inverter/keepalive/${serialNumber}`;
  client.subscribe(topic1, (err) => {
    if (err) {
      console.error(`Failed to subscribe to topic ${topic1}:`, err);
    } else {
      console.log(`Subscribed to topic ${topic1}`);
    }
  });
}

// Function to subscribe to a device-specific topic
function UnSubscribeToDevice(serialNumber) {
  const topic = `inverter/response/${serialNumber}`;
  client.unsubscribe(topic, (err) => {
    if (err) {
      console.error(`Failed to unsubscribe to topic ${topic}:`, err);
    } else {
      console.log(`Unsubscribed to topic ${topic}`);
    }
  });

  const topic1 = `inverter/keepalive/${serialNumber}`;
  client.unsubscribe(topic1, (err) => {
    if (err) {
      console.error(`Failed to unsubscribe to topic ${topic1}:`, err);
    } else {
      console.log(`Unsubscribed to topic ${topic1}`);
    }
  });
}

module.exports = {
  sendCommandToInverter,subscribeToDevice,UnSubscribeToDevice
};
