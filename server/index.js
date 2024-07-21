const express = require('express');
const cors = require('cors');
const corsOptions = require('./app/middlewares/corsMiddleware');
const commandsGetRoutes = require('./app/routes/commandsGetRoutes');
const commandsPostRoutes = require('./app/routes/commandsPostRoutes');
const ledRoutes = require('./app/routes/ledRoutes');
require('./app/mqtt/mqttClient');
const dbConnect = require("./app/db/dbConnect");
const bcrypt = require("bcrypt");
const User = require("./app/models/userModel");
const Device = require("./app/models/deviceModel");
const jwt = require("jsonwebtoken");
const auth = require("./app/auth");
const { subscribeToDevice, UnSubscribeToDevice} = require("./app/mqtt/mqttClient");
const { subscribeToAllDevices} = require("./app/utils/subscribeToAllDevices")
const app = express();
const port = 3000;



// execute database connection 
dbConnect();
// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/inverter', commandsGetRoutes);
app.use('/api/inverter', commandsPostRoutes);
app.use('/api', ledRoutes);

subscribeToAllDevices()

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

app.get('/api/devices', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices' });
  }
});

// authentication endpoint
app.get("/auth-endpoint",auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});


app.post("/api/registerdevice", async  (req, res) => {
  const { email, serialNumber } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const existingDevice = await Device.findOne({ serialNumber });
  if (existingDevice) {
    if (existingDevice.user !== email) {
      return res.status(400).json({ error: 'Device already registered to another user' });
    }
    return res.status(200).json({ message: 'Device already registered to this user' });
  }

  const newDevice = new Device({ serialNumber, user: email, online: false });
  await newDevice.save();

  user.devices.push(serialNumber);
  await user.save();

  // Subscribe to the device-specific response topic
  subscribeToDevice(serialNumber);

  res.status(201).json({ message: 'Device registered successfully' });
});

app.post('/api/unregisterdevice', async (req, res) => {
  const { email, serialNumber } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deviceIndex = user.devices.indexOf(serialNumber);
  if (deviceIndex === -1) {
    return res.status(400).json({ error: 'Device not registered to this user' });
  }

  const device = await Device.findOne({ serialNumber });
  if (device) {
    await device.remove();
  }

  user.devices.splice(deviceIndex, 1);
  await user.save();

  // Unsubscribe from the device-specific response topic
  UnSubscribeToDevice(serialNumber);

  res.status(200).json({ message: 'Device unregistered successfully' });
});



app.post("/api/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
app.post("/api/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
