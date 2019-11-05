const MongoLib = require('../lib/mongo');

class UserAirlineFlight {
  constructor() {
    this.collection = 'user-airlineFlights';
    this.mongoDB = new MongoLib();
  }

  async getUserAirlineFlights({ userId }) {
    const query = userId && { userId };
    const userAirlineFlights = this.mongoDB.getAll(this.collection, query);
    return userAirlineFlights;
  }

  async createUserAirlineFlight({ userAirlineFligh }) {
    const userAirlineFlightId = this.mongoDB.create(this.collection, { userAirlineFligh });
    return userAirlineFlightId;
  }
}

module.exports = UserAirlineFlight;