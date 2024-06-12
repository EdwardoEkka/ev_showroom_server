// bookModel.js

const mongoose = require('mongoose');

// Define the schema for the contact form data
const bookingSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model using the schema
const Bookings = mongoose.model('Bookings', bookingSchema);

module.exports = Bookings;
