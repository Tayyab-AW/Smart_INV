const { sendCommandToInverter } = require('../mqtt/mqttClient');

const postCommandHandler = (command) => {
  return async (req, res) => {
    try {
      console.log('Received command:', command); // Debugging line

      // Handle command processing logic here
      if (!command) {
        console.log('Invalid command:', command); // Debugging line
        return res.status(400).json({ error: 'Invalid command' });
      }

      const rawData = await sendCommandToInverter(command);
      // const parsedData = parseInverterResponsePost(rawData); // Uncomment if needed
      res.json([rawData]); // Send data as an array
    } catch (error) {
      console.error(`Error in ${command} endpoint:`, error);
      res.status(500).json({ error: `Failed to change setting on inverter for command ${command}` });
    }
  };
};

module.exports = postCommandHandler;
