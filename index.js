const express = require('express');
const { connectToDb, getDb } = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors());

connectToDb((err) => {
  if (err) {
    console.error('Error occurred while connecting to the database:', err);
    return;
  }
  console.log('Connected successfully to the database');
});

app.use('/', require('./router/routes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));