"use strict"

const mongoose = require("mongoose")

const config = require("../../config")

// Connect to the Mongo Database.
mongoose.Promise = global.Promise
mongoose.connect(
  config.database,
  { useNewUrlParser: true }
)

const IpAddresses = require("../../src/models/ip-addresses")

async function getIpAddresses() {
  const ipAddresses = await IpAddresses.find({})
  console.log(`ip addresses: ${JSON.stringify(ipAddresses, null, 2)}`)

  mongoose.connection.close()
}
getIpAddresses()

module.exports = {
  getIpAddresses
}
