'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonSchema = new Schema({
  id: String, // custom string id
  name: {
    first: String,
    last: String
  },
  aliases: String,
  moviesAsActor: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  moviesAsDirector: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  moviesAsProducer: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
}, { collection: 'people' })

module.exports = mongoose.model('Person', PersonSchema)
