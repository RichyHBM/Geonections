//Express app
var path = require('path');
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

module.exports = app;