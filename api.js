'use strict'

const express = require('express')
const expressJwt = require('express-jwt')
const guard = require('express-jwt-permissions')()

const { check, validationResult } = require('express-validator/check')
const debug = require('debug')('the_movie_site:api')
const uuid = require('uuid/v4')

const personModel = require('./models/person')
const movieModel = require('./models/movie')
const personLib = require('./lib/person')
const movieLib = require('./lib/movie')
const personMovieLib = require('./lib/personMovie')

const config = require('./config')

const Person = personLib(personModel)
const Movie = movieLib(movieModel)
const PersonMovie = personMovieLib(personModel,movieModel)

const api = express.Router()

api.get('/persons', async (req, res, next) => {
  debug('/persons request')
  let people
  try {
    people = await Person.findAll()
  } catch (e) {
    return next(e)
  }
  res.json(people)
})

api.get('/persons/:id', async (req, res, next) => {
  const { id } = req.params
  debug(`/persons/${id} request`)
  let person
  try {
    person = await Person.findById(id)
  } catch (e) {
    return next(e)
  }
  res.json(person)
})

api.get('/movies', async (req, res, next) => {
  debug('/movies request')
  let movies
  try {
    movies = await Movie.findAll()
  } catch (e) {
    return next(e)
  }
  res.json(movies)
})

api.get('/movies/:id', async (req, res, next) => {
  const { id } = req.params
  debug(`/movies/${id} request`)
  let movie
  try {
    movie = await Movie.findById(id)
  } catch (e) {
    return next(e)
  }
  res.json(movie)
})

api.post('/persons', expressJwt(config.auth), guard.check(['admin']),[
  //validate and sanitize the fields
  check('first').isAlpha().trim().escape(),
  check('last').isAlpha().trim().escape()
], async (req,res,next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/persons post request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }

  debug('/persons post request')
  const {
    first,
    last,
    aliases,
  } = req.body

  const id = uuid()
  let newPerson
  try {
    newPerson = await Person.createOrUpdate({'id':id,'name': {'first':first,'last':last},'aliases':aliases})
  } catch (e) {
    return next(e)
  }
  res.status(201).json(newPerson)
})

api.put('/persons/:id', expressJwt(config.auth), guard.check(['admin']),[
  //validate and sanitize the fields
  check('first').isAlpha().trim().escape(),
  check('last').isAlpha().trim().escape(),
  check('id').escape()
], async (req,res,next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/persons post request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    first,
    last,
    aliases,
  } = req.body
  const { id } = req.params
  debug(`/persons/${id} put request`)
  let editedPerson
  try {
    editedPerson = await Person.createOrUpdate({'id':id,'name': {'first':first,'last':last},'aliases':aliases})
  } catch (e) {
    return next(e)
  }
  res.json(editedPerson)
})

api.post('/movies', expressJwt(config.auth), guard.check(['admin']), [
  //validate and sanitize the fields
  check('title').not().isEmpty().trim().escape(),
  check('releaseYear').isNumeric().trim().escape()
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/movies post request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    title,
    releaseYear
  } = req.body

  const id = uuid()
  let newMovie
  try {
    newMovie = await Movie.createOrUpdate({'id':id, 'title': title, 'releaseYear': releaseYear})
  } catch (e) {
    return next(e)
  }
  res.status(201).json(newMovie)
})

api.put('/movies/:id', expressJwt(config.auth), guard.check(['admin']), [
  //validate and sanitize the fields
  check('title').not().isEmpty().trim().escape(),
  check('releaseYear').isNumeric().trim().escape(),
  check('id').escape()
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/movies put request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    title,
    releaseYear
  } = req.body

  const { id } = req.params
  let editedMovie
  try {
    editedMovie = await Movie.createOrUpdate({'id':id, 'title': title, 'releaseYear': releaseYear})
  } catch (e) {
    return next(e)
  }
  res.json(editedMovie)
})

api.post('/persons/:id/movies', expressJwt(config.auth), guard.check(['admin']), [
  //validate and sanitize the fields
  check('idMovie').not().isEmpty().trim().escape(),
  check('rol').not().isEmpty().isAlpha().trim().escape(),
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/movies put request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    idMovie,
    rol
  } = req.body
  const idPerson = req.params.id
  try {
    switch(rol){
      case 'actor':
        await PersonMovie.addMovieAsActor(idPerson, idMovie)
        break
      case 'director':
        await PersonMovie.addMovieAsDirector(idPerson, idMovie)
        break
      case 'producer':
        await PersonMovie.addMovieAsProducer(idPerson, idMovie)
        break
      default:
        return res.status(422).json({ error: 'incorrect rol given'});
    }
  } catch (e) {
    return next(e)
  }

  res.status(204).send()
})

api.post('/movies/:id/persons', expressJwt(config.auth), guard.check(['admin']), [
  //validate and sanitize the fields
  check('idPerson').not().isEmpty().trim().escape(),
  check('rol').not().isEmpty().isAlpha().trim().escape(),
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/movies put request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    idPerson,
    rol
  } = req.body

  const id = req.params.id

  try {
    switch(rol){
      case 'actor':
        await PersonMovie.addMovieAsActor(idPerson, id)
        break
      case 'director':
        await PersonMovie.addMovieAsDirector(idPerson, id)
        break
      case 'producer':
        await PersonMovie.addMovieAsProducer(idPerson, id)
        break
      default:
        return res.status(422).json({ error: 'incorrect rol given'});
    }
  } catch (e) {
    return next(e)
  }

  res.status(204).send()
})

api.delete('/persons/:id/movies', expressJwt(config.auth), guard.check(['admin']), [
  //validate and sanitize the fields
  check('idPerson').not().isEmpty().trim().escape(),
  check('idMovie').not().isEmpty().trim().escape(),
  check('rol').not().isEmpty().isAlpha().trim().escape(),
], async (req,res,next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/movies put request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    idPerson,
    idMovie,
    rol
  } = req.body
  try {
    switch(rol){
      case 'actor':
        await PersonMovie.removeMovieAsActor(idPerson, idMovie)
        break
      case 'director':
        await PersonMovie.removeMovieAsDirector(idPerson, idMovie)
        break
      case 'producer':
        await PersonMovie.removeMovieAsProducer(idPerson, idMovie)
        break
      default:
        return res.status(422).json({ error: 'incorrect rol given'});
    }
  } catch (e) {
    return next(e)
  }

  res.status(204).send()
})

api.delete('/movies/:id/persons', expressJwt(config.auth), guard.check(['admin']), [
  //validate and sanitize the fields
  check('idPerson').not().isEmpty().trim().escape(),
  check('idMovie').not().isEmpty().trim().escape(),
  check('rol').not().isEmpty().isAlpha().trim().escape(),
], async (req,res,next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/movies put request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    idPerson,
    idMovie,
    rol
  } = req.body
  try {
    switch(rol){
      case 'actor':
        await PersonMovie.removeMovieAsActor(idPerson, idMovie)
        break
      case 'director':
        await PersonMovie.removeMovieAsDirector(idPerson, idMovie)
        break
      case 'producer':
        await PersonMovie.removeMovieAsProducer(idPerson, idMovie)
        break
      default:
        return res.status(422).json({ error: 'incorrect rol given'});
    }
  } catch (e) {
    return next(e)
  }

  res.status(204).send()
})

api.delete('/persons', expressJwt(config.auth), guard.check(['admin']), [
  //validate and sanitize the fields
  check('idPerson').not().isEmpty().trim().escape(),
], async (req,res,next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/movies put request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }
  const { idPerson } = req.body
  let resultPerson, resultMovies
  try {
    resultPerson = await Person.remove(idPerson)
    //in case the person already was deleted or wrong id
    //use this for prevent attempt to delete from movies
    if(resultPerson){
      resultMovies = await PersonMovie.removeFromMovies(resultPerson._id)
    }
  } catch (e) {
    return next(e)
  }

  res.send(resultPerson)
})

api.delete('/movies', expressJwt(config.auth), guard.check(['admin']), [
  //validate and sanitize the fields
  check('idMovie').not().isEmpty().trim().escape(),
], async (req,res,next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    debug('/movies put request error: ', errors.array())
    return res.status(422).json({ errors: errors.array() });
  }
  const { idMovie } = req.body
  let resultMovie, resultPersons
  try {
    resultMovie = await Movie.remove(idMovie)
    //in case the movie already was deleted or wrong id
    //use this for prevent attempt to delete from persons
    if(resultMovie){
      resultPersons = await PersonMovie.removeFromPersons(resultMovie._id)
    }
  } catch (e) {
    return next(e)
  }

  res.send(resultMovie)
})

module.exports = api
