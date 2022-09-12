const http = require('http')
const app = require('./app')
const port = 3030;
const server = http.createServer(app)
const clients = []	//track connected clients
const util = require('util')


server.listen(port)