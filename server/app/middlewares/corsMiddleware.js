const whitelist = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://192.168.0.181:5173',
    'http://192.168.0.181:8081',
    'https://react.tayyabaw.com',
    'https://api-smartinv.tayyabaw.com/',
    'https://smartinv.tayyabaw.com/'
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };
  
  module.exports = corsOptions;
  