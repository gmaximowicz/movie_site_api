'use strict'

module.exports = function setupPersonMovie (personModel, movieModel) {
  const person = personModel
  const movie = movieModel

  async function addMovieAsDirector (idPerson, idMovie) {
    const existingPerson = await person.findOne({ id: idPerson })
    const existingMovie = await movie.findOne({ id: idMovie })

    if (!existingPerson || !existingMovie) {
      throw new Error('no person or movie with the id given')
    }

    const existsInPerson = existingPerson.moviesAsDirector.find(movie => movie.toString() === existingMovie._id.toString())

    if (!existsInPerson) {
      existingPerson.moviesAsDirector.push(existingMovie._id)
      await existingPerson.save()
    }

    const existsInMovie = existingMovie.directors.find(director => director.toString() === existingPerson._id.toString())

    if (!existsInMovie) {
      existingMovie.directors.push(existingPerson._id)
      await existingMovie.save()
    }
  }

  async function addMovieAsActor (idPerson, idMovie) {
    const existingPerson = await person.findOne({ id: idPerson })
    const existingMovie = await movie.findOne({ id: idMovie })

    if (!existingPerson || !existingMovie) {
      throw new Error('no person or movie with the id given')
    }

    const existsInPerson = existingPerson.moviesAsActor.find(movie => movie.toString() === existingMovie._id.toString())

    if (!existsInPerson) {
      existingPerson.moviesAsActor.push(existingMovie._id)
      await existingPerson.save()
    }

    const existsInMovie = existingMovie.casting.find(cast => cast.toString() === existingPerson._id.toString())

    if (!existsInMovie) {
      existingMovie.casting.push(existingPerson._id)
      await existingMovie.save()
    }
  }

  async function addMovieAsProducer (idPerson, idMovie) {
    const existingPerson = await person.findOne({ id: idPerson })
    const existingMovie = await movie.findOne({ id: idMovie })

    if (!existingPerson || !existingMovie) {
      throw new Error('no person or movie with the id given')
    }

    const existsInPerson = existingPerson.moviesAsProducer.find(movie => movie.toString() === existingMovie._id.toString())

    if (!existsInPerson) {
      existingPerson.moviesAsProducer.push(existingMovie._id)
      await existingPerson.save()
    }

    const existsInMovie = existingMovie.producers.find(producer => producer.toString() === existingPerson._id.toString())

    if (!existsInMovie) {
      existingMovie.producers.push(existingPerson._id)
      await existingMovie.save()
    }
  }

  async function removeMovieAsActor (idPerson, idMovie) {
    const existingPerson = await person.findOne({ id: idPerson })
    const existingMovie = await movie.findOne({ id: idMovie })

    if (!existingPerson || !existingMovie) {
      throw new Error('no person or movie with the id given')
    }

    await person.findOneAndUpdate({ _id: existingPerson._id }, { $pull: { moviesAsActor: existingMovie._id } })
    await movie.findOneAndUpdate({ _id: existingMovie._id }, { $pull: { casting: existingPerson._id } })
  }

  async function removeMovieAsDirector (idPerson, idMovie) {
    const existingPerson = await person.findOne({ id: idPerson })
    const existingMovie = await movie.findOne({ id: idMovie })

    if (!existingPerson || !existingMovie) {
      throw new Error('no person or movie with the id given')
    }

    await person.findOneAndUpdate({ _id: existingPerson._id }, { $pull: { moviesAsDirector: existingMovie._id } })
    await movie.findOneAndUpdate({ _id: existingMovie._id }, { $pull: { directors: existingPerson._id } })
  }

  async function removeMovieAsProducer (idPerson, idMovie) {
    console.log('remove producer')
    const existingPerson = await person.findOne({ id: idPerson })
    const existingMovie = await movie.findOne({ id: idMovie })

    if (!existingPerson || !existingMovie) {
      throw new Error('no person or movie with the id given')
    }
    console.log(typeof(existingMovie._id))
    console.log(existingPerson._id)
    await person.findOneAndUpdate({ _id: existingPerson._id }, { $pull: { moviesAsProducer: existingMovie._id } })
    await movie.findOneAndUpdate({ _id: existingMovie._id }, { $pull: { producers: existingPerson._id } })
  }

  async function removeFromMovies (idPerson) {
    const resultCasting = movie.updateMany({ casting : idPerson }, { $pull: { casting: idPerson } })
    const resultDirectors = movie.updateMany({ directors : idPerson }, { $pull: { directors: idPerson } })
    const resultProducers = movie.updateMany({ producers : idPerson }, { $pull: { producers: idPerson } })

    const result = await Promise.all([resultCasting,resultProducers,resultDirectors])

    return result
  }

  async function removeFromPersons (idMovie) {
    const resultActor = person.updateMany({ moviesAsActor : idMovie }, { $pull: { moviesAsActor: idMovie } })
    const resultDirector = person.updateMany({ moviesAsDirector : idMovie }, { $pull: { moviesAsDirector: idMovie } })
    const resultProducer = person.updateMany({ moviesAsProducer : idMovie }, { $pull: { moviesAsProducer: idMovie } })

    const result = await Promise.all([resultActor,resultProducer,resultDirector])

    return result
  }

  return {
    addMovieAsDirector,
    addMovieAsActor,
    addMovieAsProducer,
    removeMovieAsActor,
    removeMovieAsDirector,
    removeMovieAsProducer,
    removeFromMovies,
    removeFromPersons
  }
}
