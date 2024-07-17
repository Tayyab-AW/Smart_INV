const express = require('express');
const cors = require('cors');
const corsOptions = require('./app/middlewares/corsMiddleware');
const commandsGetRoutes = require('./app/routes/commandsGetRoutes');
const commandsPostRoutes = require('./app/routes/commandsPostRoutes');
const ledRoutes = require('./app/routes/ledRoutes');
require('./app/mqtt/mqttClient');

const app = express();
const port = 3000;

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/inverter', commandsGetRoutes);
app.use('/api/inverter', commandsPostRoutes);
app.use('/api', ledRoutes);

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
