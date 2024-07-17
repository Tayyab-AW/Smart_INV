const { sendCommandToInverter } = require('../mqtt/mqttClient');

const getCommandHandler = (command) => {
  return async (req, res) => {
    try {
      console.log('Received command:', command); // Debugging line
      
      // Handle command processing logic here
      if (!command) {
        console.log('Invalid command:', command); // Debugging line
        return res.status(400).json({ error: 'Invalid command' });
      }

      const data = await sendCommandToInverter(command);
      console.log('Command response data:', data); // Debugging line
      res.json([data]); // Send data as an array
    } catch (error) {
      console.error('Error in command endpoint:', error);
      res.status(500).json({ error: 'Failed to get response from inverter' });
    }
  };
};

module.exports = getCommandHandler;
