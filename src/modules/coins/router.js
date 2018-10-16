// const ensureUser = require('../../middleware/validators')
const coins = require('./controller')

// export const baseUrl = '/users'
module.exports.baseUrl = '/coins'

module.exports.routes = [
  /*
  {
    method: 'POST',
    route: '/',
    handlers: [
      user.createUser
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      user.getUsers
    ]
  },
  */

  {
    method: 'GET',
    route: '/:bchaddr',
    handlers: [
      // ensureUser,
      coins.getCoins
    ]
  }

  /*
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureUser,
      user.getUser,
      user.updateUser
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      ensureUser,
      user.getUser,
      user.deleteUser
    ]
  }
  */
]
