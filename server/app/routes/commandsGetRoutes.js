const express = require('express');
const getCommandHandler = require('../controllers/commandsGetController');

const router = express.Router();

const commandsGet = ['QID', 'QSID', 'QVFW', 'QVFW2', 'QPIRI', 'QFLAG', 'QPIGS', 'QPGSn', 'QMOD', 'QPIWS', 'QDI', 'QMCHGCR', 'QMUCHGCR', 'QOPM', 'QMN', 'QGMN', 'QBEQI'];

commandsGet.forEach(command => {
  router.get(`/${command}`, async (req, res) => {
    try {
      const handler = getCommandHandler(command);
      await handler(req, res);
    } catch (error) {
      console.error('Error handling command:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

module.exports = router;
