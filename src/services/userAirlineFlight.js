const MongoLib = require('../lib/mongo');

class UserAirlineFlight {
  constructor() {
    this.collection = 'user-airlineFlights';
    this.mongoDB = new MongoLib();
  }

  async getUserAirlineFlights({ userId }) {
    const query = userId && { userId };
    console.log(query);
    const userAirlineFlights = this.mongoDB.getAll(this.collection, query);
    return userAirlineFlights;
  }


  async createUserAirlineFlight({ userAirlineFligth }) {
    console.log(userAirlineFligth)
    const userAirlineFlightId = this.mongoDB.create(this.collection, userAirlineFligth);
    return userAirlineFlightId;
  }
}

module.exports = UserAirlineFlight;