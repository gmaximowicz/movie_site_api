'use strict'

const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const debug = require('debug')('the_movie_site:app')
const database = require('./lib/db')

const port = process.env.PORT || 3000
const config = {
  database: process.env.DB || 'the_movie_site',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '27017'
}
const api = require('./api')
const auth = require('./auth')
const app = express()
const server = http.createServer(app)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/api', api)
app.use('/auth', auth)

app.get('/', (req, res) => {
  res.send('<h1>hello from the movies</h1>')
})

// Handle error middleware
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) { return res.status(404).send({ error: err.message }) }

  res.status(500).send({ error: err.message })
})

function handleFatalError (err) {
  console.error('==== Fatal error ====')
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

database(config)
  .then(() => {
    server.listen(port, () => {
      debug('==== Server =====')
      debug(`started at por ${port}`)
    })
  })
  .catch(handleFatalError)
