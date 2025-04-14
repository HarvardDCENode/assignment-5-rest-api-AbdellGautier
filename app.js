const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const apievents = require('./routes/api/events');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`)
   .then(() => {
      console.log("Connected to MongoDB Atlas successfully!");
   })
   .catch((err) => {
      console.error("Error connecting to MongoDB Atlas: ", err);
   });

// initialize express
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

// set up routes and routers
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/api/events', apievents);

app.use('/', (req, res) => {
   res.send("Go to /static/index.html to see the RESTApi client.");
});

// catch any remaining routing errors
app.use((req, res, next)=>{
  const err = new Error('Not Found' + req.url);
  err.status = 404;
  next(err);
});

module.exports = app;