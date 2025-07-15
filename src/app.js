// app.js
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const routes = require('./routes');
const uuidSession = require('./middleware/uuidSession');

const app = express();

// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(uuidSession);

// Static files
app.use(express.static(path.join(__dirname, 'source/public')));

// View engine
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'source/resources/views'));

// Routes
app.use('/', routes);

module.exports = app;