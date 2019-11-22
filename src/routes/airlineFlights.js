const express = require('express');
const passport = require('passport');
const AirlineFlightService = require('../services/airlineFlight');
const cacheResponse = require('../utils/cacheResponse');
const scopeValidacionHandler = require('../utils/middleware/scopesValidacionHandler');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time');

//JWT atrategy
require('../utils/auth/strategies/jwt');

const travelPlanMaster = (app) => {
  const router = express.Router();
  app.use('/api/airlineFlight', router);

  const airlineFlightService = new AirlineFlightService();

  router.get('/',
    //passport.authenticate('jwt', { session: false }),
    //scopeValidacionHandler(['read:airlineFligth']),
    async (req, res, next) => {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
      console.log(FIVE_MINUTES_IN_SECONDS)
      const airlineFlights = await airlineFlightService.getAirlineFlight()
      res.status(200).json({
        data: airlineFlights,
        message: 'airlineFlights listed'
      });
    });


  router.get('/:airFligthId',
    async function (
      req,
      res,
      next
    ) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
      const { airFligthId } = req.params;

      try {
        const airLineFligth = await airlineFlightService.getAirlineFligthById(airFligthId);
        res.status(201).json({
          data: airLineFligth,
          message: ' airlineFlight listed'
        });
      } catch (err) {
        next(err);
      }
    });
  router.post('/',
    // passport.authenticate('jwt', { session: false }), 
    // scopeValidacionHandler(['create:airlineFligth']),
    async function (
      req,
      res,
      next
    ) {
      const { body: airlineFlight } = req;

      try {
        const createAirlineFlightId = await airlineFlightService.createAirlineFlight({ airlineFlight });
        res.status(201).json({
          data: createAirlineFlightId,
          message: 'Create airlineFlight'
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