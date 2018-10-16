const mongoose = require('mongoose')

const ipAddressModel = new mongoose.Schema({
  ipAddresses: []
})

// export default mongoose.model('user', User)
module.exports = mongoose.model('ipAddressModel', ipAddressModel)
