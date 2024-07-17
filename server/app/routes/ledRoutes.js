const express = require('express');
const { ledOnHandler, ledOffHandler } = require('../controllers/ledController');

const router = express.Router();

router.post('/led-on', ledOnHandler);
router.post('/led-off', ledOffHandler);

module.exports = router;
