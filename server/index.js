// const express = require('express');
// const cors = require('cors');
// const mqtt = require('mqtt');
// const bodyParser = require('body-parser');
// const WebSocket = require('ws');

// const app = express();
// const port = 3000;

// // CORS configuration
// const whitelist = [
//   'http://localhost:5173',
//   'http://localhost:3000',
//   'http://192.168.0.181:5173',
//   'http://192.168.0.181:8081',
//   'https://react.tayyabaw.com',
//   'https://api-smartinv.tayyabaw.com/'
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // Create a WebSocket server
// const server = require('http').createServer(app);
// const wss = new WebSocket.Server({ server });

// // Broadcast to all connected clients
// wss.broadcast = function broadcast(data) {
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(data);
//     }
//   });
// };

// // MQTT Client Configuration
// const mqttClient = mqtt.connect('mqtt://localhost:1883');

// // Subscribe to the topic to receive messages from ESP32
// mqttClient.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   mqttClient.subscribe('inverter/response', (err) => {
//     if (!err) {
//       console.log('Subscribed to inverter/response topic');
//     }
//   });
  
//   mqttClient.subscribe('inverter/command/received', (err) => {
//     if (!err) {
//       console.log('Subscribed to inverter/command/received topic');
//     }
//   });
// });

// // Log inverter responses and received commands
// mqttClient.on('message', (topic, message) => {
//   if (topic === 'inverter/response') {
//     console.log('Inverter Response:', message.toString());
//     // Broadcast the response to all WebSocket clients
//     wss.broadcast(message.toString());
//   } else if (topic === 'inverter/command/received') {
//     console.log('Received Command:', message.toString());
//   }
// });

// // Endpoint to send a command to the inverter
// app.post('/api/send-command', (req, res) => {
//   const command = req.body.commanda;
//   console.log(command)
//   mqttClient.publish('inverter/command', command);
//   res.send({ response: 'Command sent' });
// });

// // Endpoint to turn on the LED
// app.post('/api/led-on', (req, res) => {
//   mqttClient.publish('inverter/command', 'LED_ON');
//   res.send({ status: 'LED ON command sent' });
// });

// // Endpoint to turn off the LED
// app.post('/api/led-off', (req, res) => {
//   mqttClient.publish('inverter/command', 'LED_OFF');
//   res.send({ status: 'LED OFF command sent' });
// });

// // Endpoint to get the latest data from the inverter
// app.get('/api/data', (req, res) => {
//   mqttClient.publish('inverter/command', 'refreshData');
//   mqttClient.once('message', (topic, message) => {
//     if (topic === 'inverter/response') {
//       res.send({ data: message.toString() });
//     }
//   });
// });

// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const port = 3000;

// CORS configuration
const whitelist = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://192.168.0.181:5173',
  'http://192.168.0.181:8081',
  'https://react.tayyabaw.com',
  'https://api-smartinv.tayyabaw.com/'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

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
      // console.log(message.toString())
    const messageStr = message.toString();
    const [command, response] = messageStr.split(';');
    // const cleanedResponse = response.replace(/[^a-zA-Z0-9]/g, '');
    const cleanedResponse = response.replace(/[{()}]/g, '');
    const parsedResponse = parseInverterResponseGet(command, cleanedResponse);
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
}}
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

function parseInverterResponseGet(command, response) {
    const cleanedResponse = response.replace(/[^a-zA-Z0-9 . :]/g, ' ');
  
  if (command === 'QID') {
    const fields = cleanedResponse.split(' ');
    return {
      serialNumber: fields[0],
    };
} else if (command === 'QSID') {
  const fields = cleanedResponse.split(' ');
  return {
    serialNumber: fields[0],
  };
} else if (command === 'QVFW') {
  const cleanedResponse1 = cleanedResponse.replace(/[^0-9 .]/g, '');
  const fields = cleanedResponse1.split('.');
  return {
    mainCPUFirmware: fields[0],
    version: fields[1],

  };
} else if (command === 'QVFW2') {
  const cleanedResponse1 = cleanedResponse.replace(/[^0-9 .]/g, '');
  const cleanedResponse2 = cleanedResponse1.substring(1);
  const fields = cleanedResponse2.split('.');
  return {
    mainCPUFirmware: fields[0],
    version: fields[1],

  };
} else if (command === 'QPIRI') {
    const fields = cleanedResponse.split(' ');
    return {
      gridRatingVoltage: fields[0],
      gridRatingCurrent: fields[1],
      AcOutputRatingVoltage: fields[2],
      AcOutputRatingFrequency: fields[3],
      AcOutputRatingCurrent: fields[4],
      AcOutputRatingApparentPower: fields[5],
      AcOutputRatingAcitvePower: fields[6],
      batteryRatingVoltage: fields[7],
      batteryRechargeVoltage: fields[8],
      batteryUnderVoltage: fields[9],
      batteryBulkVoltage: fields[10],
      batteryFloatVoltage: fields[11],
      batteryType: fields[12],
      maxAcChargingCurrent: fields[13],
      currentMaxChargingCurrent: fields[14],
      inputVoltageRange: fields[15],
      outputSourcePriority: fields[16],
      chargeSourcePriority: fields[17],
      parallelMaxNumber: fields[18],
      machineType: fields[19],
      toplogy: fields[20],
      outputMode: fields[21],
      batteryReDischargeVoltage: fields[22],
      pvOkCondtionForParallel: fields[23],
      pvPowerBalance: fields[24],
      maxChargingTimeAtCvStage: fields[25],
    };
} else if (command === 'QFLAG') {
    // Assume QFLAG response is a string of characters
    const flags = cleanedResponse.split('');
    return {
      enableDisableSilenceBuzzerOrOpenBuzzer: flags[0],
      enableDisableOverloadBypassFunction: flags[1],
      enableDisablePowerSaving: flags[2],
      enableDisableLcdDisplayEscapeToDefaultPageAfter1MinTimeout: flags[3],
      enableDisableOverLoadRestart: flags[4],
      enableDisableOverTemperatureRestart: flags[5],
      enableDisableBackLightOn: flags[6],
      enableDisableAlarmOnWhenPrimarySourceinterrupt : flags[7],
      enableDisableFaultCodeRecord: flags[8],
        // add other fields based on the response format
    };
} else if (command === 'QPIGS') {
  const fields = cleanedResponse.split(' ');
  return {
    gridVoltage: fields[0],
    gridFrequency: fields[1],
    outputVoltage: fields[2],
    outputFrequency: fields[3],
    outputPowerApparent: fields[4],
    outputPowerActive: fields[5],
    outputLoadPercent: fields[6],
    busVoltage: fields[7],
    batteryVoltage: fields[8],
    batteryChargingCurrent: fields[9],
    batteryCapacity: fields[10],
    inverterHeatSinkTemperature: fields[11],
    pvInputCurrentForBattery: fields[12],
    pvInputVoltage: fields[13],
    batteryVoltageSCC: fields[14],
    batteryDischargeCurrent: fields[15],
    InverterStatus: fields[16],
    BatteryVoltageOffsetForFansOn: fields[17],
    EEPROMVersion: fields[18],
    PVChargingPower: fields[19],
    InverterStatus: fields[20],
  };
} else if (command === 'QPGSn') {
  const fields = cleanedResponse.split(' ');
  return {
    deviceMode: fields[0],
  };
} else if (command === 'QMOD') {
  const fields = cleanedResponse.split(' ');
  return {
    inverterMode: fields[0],
  };
} else if (command === 'QPIWS') {
  const fields = cleanedResponse.split('');
  return {
              inverterFault: fields[0],
              busOver: fields[1],
              busUnder: fields[2],
              busSoftFail: fields[3],
              lineFail: fields[4],
              opvShort: fields[5],
              inverterVoltageLow: fields[6],
              inverterVoltageHigh: fields[7],
              overTemperature: fields[8],
              fanLocked: fields[9],
              batteryVoltageTooHigh: fields[10],
              batteryLowAlarm: fields[11],
              overCharge: fields[12],
              batteryUnderShutdown: fields[13],
              batteryDerating: fields[14],
              overLoad: fields[15],
              eepromFault: fields[16],
              inverterOverCurrent: fields[17],
              inverterSoftFail: fields[18],
              selfTestFail: fields[19],
              opDcVoltageOver: fields[20],
              batOper: fields[21],
              currentSensorFail: fields[22],
              batteryShort: fields[23],
              powerLimit: fields[24],
              pvVoltageHigh: fields[25],
              mpptOverloadFault: fields[26],
              mpptOverloadWarning: fields[27],
              batteryTooLowToCharge: fields[28],
  };
} else if (command === 'QDI') {
  const fields = cleanedResponse.split(' ');
  return {
    acOutputVoltage: fields[0],
    acOuputFrequency: fields[1],
    maxAcChargingCurrent: fields[2],
    batteryUnderVoltage: fields[3],
    chargingFloatVoltage: fields[4],
    chargingBulkVoltage: fields[5],
    batteryDefaultReChargeVoltage: fields[6],
    maxChargingCurrent: fields[7],
    acInputVoltageRange: fields[8],
    outputSourcePriority: fields[9],
    chargeSourcePriority: fields[10],
    batteryType: fields[11],
    enableDisableSilenceBuzzerOrOpenBuzzer: fields[12],
    enableDisablePowerSaving: fields[13],
    enableDisableOverloadRestart: fields[14],
    enableDisableOverTemperatureRestart: fields[15],
    enableDisableLcdBacklightOn: fields[16],
    enableDisableAlarmOnWhenPrimarySourceInterrput: fields[17],
    enableDisableFaultCodeRecord: fields[18],
    overloadBypass: fields[19],
    enableDisableLcdDisplayEscapeToDefaultPageAfter1MinTimeout: fields[20],
    outputMode: fields[21],
    batteryReDischargeVoltage: fields[22],
    pvOkConditionForParallel: fields[23],
    pvPowerBalance: fields[24],
    maxChargingTimeAtCvStage: fields[25],
  };
} else if (command === 'QMCHGCR') {
  return { rawResponse: cleanedResponse };
} else if (command === 'QMUCHGCR') {
  return { rawResponse: cleanedResponse };
} else if (command === 'QOPM') {
  const fields = cleanedResponse.split(' ');
  return {
    outputMode: fields[0],
  };
} else if (command === 'QMN') {
  const cleanedResponse1 = cleanedResponse.replace(/[^a-zA-Z0-9 . -]/g, '');
  const fields = cleanedResponse1;
  return {
    modelName: fields,
  };
} else if (command === 'QGMN') {
  const fields = cleanedResponse.split(' ');
  return {
    modelNameNumber: fields[0],
  };
} else if (command === 'QBEQI') {
  const fields = cleanedResponse.split(' ');
  return {
    enableOrDisableEqualization: fields[0],
    eqalizationTime: fields[1],
    eqalizationPeriod: fields[2],
    equalizationMaxCurrent: fields[3],
    reserved1: fields[4],
    eqalizationVoltage: fields[5],
    reserved2: fields[6],
    eqalizationOverTime: fields[7],
    equalizationActivePower: fields[8],
    reserverd3: fields[9],
  };
} else if (command === 'PF') {
  const fields = cleanedResponse;
  return {
    response: fields,
  }}
    return { rawResponse: response };  // Fallback to return raw response if command is not specifically handled
}

function parseInverterResponsePost(command, {response}) {
  const cleanedResponse = response.replace(/[^a-zA-Z]/g, ' ');
 if (command === 'PF') {
const fields = cleanedResponse;
return {
  response: fields,
}}
  return { rawResponse: response };  // Fallback to return raw response if command is not specifically handled
}

const commandsGet = ['QID', 'QSID', 'QVFW', 'QVFW2', 'QPIRI', 'QFLAG', 'QPIGS', 'QPGSn', 'QMOD', 'QPIWS', 'QDI', 'QMCHGCR', 'QMUCHGCR', 'QOPM', 'QMN', 'QGMN', 'QBEQI'];

commandsGet.forEach(command => {
  app.get(`/api/${command}`, async (req, res) => {
  try {
        const data = await sendCommandToInverter(command);
        res.json([data]); // Send data as an array
  } catch (error) {
        console.error('Error in command endpoint:', error);
        res.status(500).json({ error: 'Failed to get response from inverter' });
  }

    });
});


app.post('/api/inverter/pf', async (req, res) => {
  const { command } = req.body;
  try {
        const rawData = await sendCommandToInverter(command);
        const parsedData = parseInverterResponsePost(command, rawData);
        res.json(parsedData);
  } catch (error) {
      console.error('Error in pf endpoint:', error);
      res.status(500).json({ error: 'Failed to set status on inverter' });
  }
});

app.post('/api/inverter/mchgc', async (req, res) => {
  const { maxChargingCurrent } = req.body;
  const command = `MCHGC${maxChargingCurrent}`; // Replace <CRC> with the actual CRC calculation
  try {
    const data = await sendCommandToInverter(command);
    res.json({ command, response: data });
  } catch (error) {
    console.error('Error in MCHGC endpoint:', error);
    res.status(500).json({ error: 'Failed to get response from inverter' });
  }
});

app.post('/api/inverter/pop', async (req, res) => {
  const { sourcePriority } = req.body;
  const command = `POP${sourcePriority}`; // Replace <CRC> with the actual CRC calculation
  try {
    const data = await sendCommandToInverter(command);
    res.json({ command, response: data });
  } catch (error) {
    console.error('Error in MCHGC endpoint:', error);
    res.status(500).json({ error: 'Failed to get response from inverter' });
  }
});




app.get('/api/response/:command', (req, res) => {
    const command = req.params.command;
    res.json({ response: inverterData[command] || 'No response yet' });
});

app.post('/api/setBatteryType', (req, res) => {
    const { batteryType, serialNumber } = req.body;
    const payload = `PBFT,${batteryType}\r`;
    client.publish(`inverter/command/${serialNumber}`, payload);
    res.json({ message: 'Set battery type command sent' });
});

// Endpoint to turn on the LED
app.post('/api/led-on', (req, res) => {
  client.publish('inverter/command', 'LED_ON');
  res.send({ status: 'LED ON command sent' });
});

// Endpoint to turn off the LED
app.post('/api/led-off', (req, res) => {
  console.log("Off")
  client.publish('inverter/command', 'LED_OFF');
  res.send({ status: 'LED OFF command sent' });
});

app.get('/', (req, res) => {
  res.send('Hello world')
});


// Add similar endpoints for other commands that require payloads

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
