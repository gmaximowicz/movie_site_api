'use strict'

module.exports = function setupPerson (PersonModel) {
  const Person = PersonModel

  async function findById (personId) {
    const returnPerson = await Person.findOne({ id: personId })
      .populate('moviesAsDirector')
      .populate('moviesAsActor')
      .populate('moviesAsProducer')
    return returnPerson
  }

  async function findAll () {
    const persons = await Person.find()
    return persons
  }

  async function createOrUpdate (data) {
    const existingPerson = await Person.findOne({ id: data.id })

    if (existingPerson) {
      const updated = await Person.findOneAndUpdate({ id: data.id }, data)
      return updated
    }
    let newPerson = new Person(data)
    const saved = await newPerson.save()
    return saved
  }
  

  async function remove(idPerson){
    const result = await Person.findOneAndDelete({ id: idPerson })
    return result
  }

  return {
    findById,
    findAll,
    createOrUpdate,
    remove
  }
}
