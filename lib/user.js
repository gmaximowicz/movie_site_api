'use strict'

const bcrypt = require('bcrypt')

module.exports = function setupUser (UserModel) {
  const User = UserModel

  async function register(data){
    const {
      id,
      first,
      last,
      password,
      email
    } = data
    const hashedPsswd = await bcrypt.hash(password, 10)
    let newUser = new User({'id':id,'name':{'first' : first, 'last': last}, 'email': email, 'password': hashedPsswd, 'roles':['user']})
    const saved = await newUser.save()
    return saved
  }

  async function getByEmail(email){
    const user = await User.findOne({'email' : email})
    return user
  }

  return {
    register,
    getByEmail
  }
}
