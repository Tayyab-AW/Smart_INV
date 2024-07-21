const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  serialNumber: { type: String, unique: true },
  user: String,
  online: Boolean,
  lastSeen: Date,
  data: {
    QPIRI: Object,
    QMOD: Object,
    QPIWS: Object
  }
    
  })

module.exports = mongoose.model.Devices || mongoose.model("Devices", DeviceSchema);
