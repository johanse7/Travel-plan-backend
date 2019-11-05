const express = require('express');
const cors = require('cors')
const app = express();
const { config } = require('./config');
const travelPlanMaster = require('./routes/airlineFlights');
const userAirLineFligthApi = require('./routes/userAirlineFlight');

app.use(cors());

app.use(express.json());

travelPlanMaster(app);
userAirLineFligthApi(app);

app.listen(config.port, err => {
  if (err) {
    console.error("Error: ", err);
    return;
  }
  console.log(`Listening http://localhost:${config.port}`);
});