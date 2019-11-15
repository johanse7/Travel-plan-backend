const express = require('express');
const passport = require('passport');
const userAirLineFligth = require('../services/userAirlineFlight');
const validationHandler = require('../utils/middleware/validationHandler');
const { userIdSchema } = require('../utils/schemas/users');
const scopeValidacionHandler = require('../utils/middleware/scopesValidacionHandler');
const {
  createUserAirLineFligthsSchema,
} = require('../utils/schemas/userAirLineFligths');

//JWT atrategy
require('../utils/auth/strategies/jwt');

function userAirLineFligthApi(app) {
  const router = express.Router();
  app.use('/api/user-arirlineFligth', router);

  const userAirLineFligthService = new userAirLineFligth();

  router.get('/', 
  passport.authenticate('jwt', { session: false }),
  scopeValidacionHandler(['read:user-airlineFligths']),
  // validationHandler({ userId: userIdSchema }, 'query'),
    async (req, res, next) => {
      const { userId } = req.query;
      try {
        const userAirlineFligths = userAirLineFligthService.getUserAirlineFlights({ userId });
        res.status(200).json({
          data: userAirlineFligths,
          message: 'user arline Fligths listed'
        });
      } catch (error) {
        next(error);
      }
    });

  router.post('/',  
  passport.authenticate('jwt', { session: false }),
  scopeValidacionHandler(['create:user-airlineFligths']),
   //validationHandler(createUserAirLineFligthsSchema),
    async (req, res, next) => {
      const { body: userAirlineFligth } = req;
      try {
        const createUserAirlineFlightId = await userAirLineFligthService.createUserAirlineFlight({ userAirlineFligth })
        res.status(201).json({
          data: createUserAirlineFlightId,
          message: 'user arline Fligths created'
        });
      } catch (error) {
        next(error);
      }
    });
}
module.exports = userAirLineFligthApi;