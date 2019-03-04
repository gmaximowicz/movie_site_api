'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { arabToRoman } = require('roman-numbers')

const MovieSchema = new Schema({
  id: String, // custom string id
  title: String,
  releaseYear: Number,
  casting: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  directors: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  producers: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
}, { toJSON: {
              virtuals: true
            },
    collection: 'movies' })

MovieSchema.virtual('releaseYearRoman').get(function () {
  return arabToRoman(this.releaseYear)
});

module.exports = mongoose.model('Movie', MovieSchema)
