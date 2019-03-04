'use strict'
const debug = require('debug')('the_movie_site:db')
const mongoose = require('mongoose')

module.exports = function connect (config) {
  return new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://${config.host}:${config.port}/${config.database}`, { useNewUrlParser: true, useFindAndModify: false })
      .then(() => {
        debug(`Database connection successful on ${config.host}:${config.port}`)
        resolve()
      })
      .catch(err => {
        return reject(err)
      })
  })
}
