'use strict'

module.exports = function setupMovie (MovieModel) {
  const Movie = MovieModel

  async function findById (movieId) {
    const returnMovie = await Movie.findOne({ id: movieId })
      .populate('casting')
      .populate('directors')
      .populate('producers')
    return returnMovie
  }

  async function findAll () {
    const movies = await Movie.find()
    .populate('casting')
    .populate('directors')
    .populate('producers')
    return movies
  }

  async function createOrUpdate (data) {
    const existingMovie = await Movie.findOne({ id: data.id })

    if (existingMovie) {
      const updated = await Movie.findOneAndUpdate({ id: data.id }, data)
      return updated
    }
    let newMovie = new Movie(data)
    const saved = await newMovie.save()
    return saved
  }

  async function remove(idMovie){
    const result = await Movie.findOneAndDelete({ id: idMovie })
    return result
  }

  return {
    findById,
    findAll,
    createOrUpdate,
    remove
  }
}
