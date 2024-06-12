const mongoose = require('mongoose');
require('dotenv').config();

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    mongoose.connect(`${process.env.DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        dbConnection = mongoose.connection;
        return cb(null); // Pass null when there's no error
      })
      .catch((err) => {
        console.error(err); // Log the error
        return cb(err); // Pass the error to the callback
      });
  },
  getDb: () => dbConnection,
};
