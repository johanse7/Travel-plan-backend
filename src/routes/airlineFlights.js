const express = require('express');
const path = require('path');
const AirlineFlightService = require('../services/airlineFlight');

const travelPlanMaster = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  const airlineFlightService = new AirlineFlightService();

  router.get('/airlineFlight', async (req, res, next) => {
    const airlineFlights = await airlineFlightService.getAirlineFlight()
    res.status(200).json({
      data: airlineFlights,
      message: 'airlineFlights listed'
    });
  });
  router.post('/airlineFlight', async function(
    req,
    res,
    next
  ) {
    const { body: airlineFlight } = req;
  
    try {
      const createAirlineFlightId = await  airlineFlightService.createAirlineFlight ({ airlineFlight });
      res.status(201).json({
        data: createAirlineFlightId,
        message: 'Create product'
      });
    } catch (err) {
      next(err);
    }
  });
  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });

};

module.exports = travelPlanMaster;