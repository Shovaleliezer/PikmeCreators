const http = require('http');
const app = require('./app')
const port = process.env.PORT || 3000;
const server = http.createServer(app)
const clients = [];	//track connected clients
const util = require('util');


server.listen(port)