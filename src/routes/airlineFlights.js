const express = require('express');
const passport = require('passport');
const AirlineFlightService = require('../services/airlineFlight');
const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS
} = require('../utils/time');

//JWT atrategy
 require('../utils/auth/strategies/jwt');

const travelPlanMaster = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  const airlineFlightService = new AirlineFlightService();

  router.get('/airlineFlight',  passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
    console.log(FIVE_MINUTES_IN_SECONDS)
    const airlineFlights = await airlineFlightService.getAirlineFlight()
    res.status(200).json({
      data: airlineFlights,
      message: 'airlineFlights listed'
    });
  });
  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });

  router.post('/airlineFlight', passport.authenticate('jwt', { session: false }), async function (
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