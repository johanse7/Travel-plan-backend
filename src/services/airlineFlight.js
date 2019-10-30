const MongoLib = require('../lib/mongo');

class AirlineFlightService {

  constructor() {
    this.collection = 'airlineFlight';
    this.mongoDB = new MongoLib();
  }
  async getAirlineFlight() {
    const airlineFlights = await this.mongoDB.getAll(this.collection);
    return airlineFlights || [];
  }
}

module.exports =  AirlineFlightService;