# movie_site_api

A simple resful api for manage movies and persons

url: https://gmaximowicz-movie-site-api.glitch.me/api/

All the post, put and delete methods accepts data in json format

The post, put and delete methods requires authentication

Users
* POST /auth/register: register a new user with rol of user, admin user set by database
  * email: string
  * password: string
  * first: string
  * last: string
  
* POST /auth/login: authenticates the user, returns a token with the roles of the user
  * email: string
  * password: string
  
All the auth methods requires the header Authorization field, with the value "Bearer access_token"

Persons
* GET /api/persons - retrieve a list of persons
* GET /api/persons/:id - retrieve all the information of one person, the id field passed is the id, not the _id
* POST /api/persons - insert a new persons, required fields:
  * first: string
  * last: string
  * aliases: string
* PUT /api/persons/:id - update the person with the id passed
* DELETE /api/persons - remove the person passed in the id
* POST /api/persons/:id/movies - add a person (id) to a movie with a determined rol
  * idMovie: string, id movie (not _id)
  * rol: string [actor|producer|director]
  
Movies
* GET /api/movies - retrieve a list of movies
* GET /api/movies/:id - retrieve all the information of one movie, the id field passed is the id, not the _id
* POST /api/movies - insert a new movie, required fields:
  * title: string
  * releaseYear: number (eg 1985)
* PUT /api/movies/:id - update the movie with the id passed
* DELETE /api/movies - remove the movie passed in the id
* POST /api/movies/:id/persons - add a person to a movie with a determined rol
  * idPerson: string, id person (not _id)
  * rol: string [actor|producer|director]
