const mongoose = require('mongoose')

const config = require('../../config')

// Connect to the Mongo Database.
mongoose.Promise = global.Promise
mongoose.connect(config.database, { useNewUrlParser: true })

const BCHAddresses = require('../../src/models/bch-addresses')

async function getBCHAddresses () {
  const bchAddresses = await BCHAddresses.find({})
  console.log(`BCH addresses: ${JSON.stringify(bchAddresses, null, 2)}`)

  mongoose.connection.close()
}
getBCHAddresses()

module.exports = {
  getBCHAddresses
}
