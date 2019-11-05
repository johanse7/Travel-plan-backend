const express = require('express');
const path = require('path');
const AirlineFlightService = require('../services/airlineFlight');
const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS
} = require('../utils/time');

const travelPlanMaster = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  const airlineFlightService = new AirlineFlightService();

  router.get('/airlineFlight', async (req, res, next) => {
    cacheResponse(res,FIVE_MINUTES_IN_SECONDS)
    const airlineFlights = await airlineFlightService.getAirlineFlight()
    res.status(200).json({
      data: airlineFlights,
      message: 'airlineFlights listed'
    });
  });
  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
  router.post('/airlineFlight', async function (
    req,
    res,
    next
  ) {
    const { body: airlineFlight } = req;

    try {
      const createAirlineFlightId = await airlineFlightService.createAirlineFlight({ airlineFlight });
      res.status(201).json({
        data: createAirlineFlightId,
        message: 'Create product'
      });
    } catch (err) {
      next(err);
    }
  });


};

module.exports = travelPlanMaster;