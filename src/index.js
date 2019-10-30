const express = require('express');
const app = express();
const { config } = require('./config');
const travelPlanMaster = require('./routes/airlineFlights');

app.use(express.json());

travelPlanMaster(app);

app.listen(config.port, err => {
  if (err) {
    console.error("Error: ", err);
    return;
  }
  console.log(`Listening http://localhost:${config.port}`);
});