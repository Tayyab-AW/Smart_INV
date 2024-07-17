const express = require('express');
const postCommandHandler = require('../controllers/commandsPostController');

const router = express.Router();

const commandsPost = ['PE', 'BSDV', 'PD', 'PF', 'MCHGC', 'MNCHGC', 'MUCHGC', 'F', 'POP', 'PBCV', 'PBDV', 'PCP', 'PGR', 'PBT', 'POPM', 'PPCP', 'PSDV', 'PCVV', 'PBFT', 'PPVOKC', 'PSPB', 'PBEQE', 'PBEQT', 'PBEQP', 'PBEQV', 'PBEQOT', 'PBEQA', 'PCVT'];

commandsPost.forEach(command => {
  router.post(`/${command}`, async (req, res) => {
    try {
      const { data } = req.body;
      const commandToSend = `${command}${data}`;
      const handler = postCommandHandler(commandToSend);
      await handler(req, res);
    } catch (error) {
      console.error(`Error handling ${command} endpoint:`, error);
      res.status(500).json({ error: `Failed to change setting on inverter for command ${command}` });
    }
  });
});

module.exports = router;
