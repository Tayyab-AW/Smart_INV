const Device = require("../models/deviceModel");
const { subscribeToDevice } = require("../mqtt/mqttClient");

// Subscribe to all devices on startup
async function subscribeToAllDevices() {
    try {
      const devices = await Device.find({});
      devices.forEach(device => {
        subscribeToDevice(device.serialNumber);
      });
    } catch (err) {
      console.error('Error loading devices from database:', err);
    }
  }

  module.exports = {
    subscribeToAllDevices
  };
  