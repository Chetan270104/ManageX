require("dotenv").config();
require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');
const dns = require('dns');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
dns.setDefaultResultOrder('ipv4first');

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MongoDB connection error: MONGO_URI is missing in backend/.env');
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    family: 4,
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

mongoose.connection.on('error', (error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

const modelsFiles = globSync('./src/models/**/*.js');

for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

// Start our app!
const app = require('./app');
const initialPort = Number(process.env.PORT) || 8888;

const startServer = (port) => {
  const server = app.listen(port, () => {
    app.set('port', port);
    console.log(`Express running → On PORT : ${server.address().port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy, retrying on ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error('Server startup error:', error);
    process.exit(1);
  });
};

startServer(initialPort);
