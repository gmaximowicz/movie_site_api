'use strict'

const express = require('express')
const { check, validationResult } = require('express-validator/check')
const debug = require('debug')('the_movie_site:auth')
const uuid = require('uuid/v4')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const config = require('./config')
const userModel = require('./models/user')
const userLib = require('./lib/user')

const User = userLib(userModel)

const auth = express.Router()

auth.post('/register',[
  check('first').isAlpha().trim().escape(),
  check('last').isAlpha().trim().escape(),
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/persons post request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    first,
    last,
    email,
    password
  } = req.body

  const id = uuid()
  let newUser
  try {
    newUser = await User.register({id,first,last,email,password})
  } catch (e) {
    return next(e)
  }
  res.status(201).json(newUser)
})

auth.post('/login',[
  check('email').isEmail()
], async (req, res, next) => {
  const {
    email,
    password
  } = req.body

  let user
  let token
  try {
    const user = await User.getByEmail(email)
    const samePsswd = await bcrypt.compare(password, user.password)
    if(email === user.email && samePsswd){
      token = jwt.sign({email: email, permissions: user.roles},config.auth.secret)
    }else{
      throw new Error('invalid user or email')
    }
  } catch (e) {
    return next(e)
  }
  res.json({token: token})
})

module.exports = auth
