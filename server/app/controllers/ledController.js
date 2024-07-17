const mqttClient = require('../mqtt/mqttClient').client;

const ledOnHandler = (req, res) => {
  mqttClient.publish('inverter/command', 'LED_ON');
  res.send({ status: 'LED ON command sent' });
};

const ledOffHandler = (req, res) => {
  mqttClient.publish('inverter/command', 'LED_OFF');
  res.send({ status: 'LED OFF command sent' });
};

module.exports = {
  ledOnHandler,
  ledOffHandler,
};
