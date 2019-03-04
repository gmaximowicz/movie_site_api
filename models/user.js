'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  id: String, // custom string id
  name: {
    first: String,
    last: String
  },
  email: {
    type: String,
    index: true,
    unique: true
  },
  password: String,
  roles: [String]
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema)
