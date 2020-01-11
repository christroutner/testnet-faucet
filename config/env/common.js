"use strict"

// export default {
//  port: process.env.PORT || 5000
// }

module.exports = {
  port: process.env.PORT || 3000,
  // Address of the app
  addr: `bchtest:qqmd9unmhkpx4pkmr6fkrr8rm6y77vckjvqe8aey35`,

  // 0.1 BCH, represent in satoshis
  bchToSend: 10000000,

  // Throttle on the amount of BCH the app can send in an hour.
  // 1 BCH per hour.
  bchPerHour: 100000000
}
