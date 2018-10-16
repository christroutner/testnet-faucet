const mongoose = require('mongoose')

const bchAddressModel = new mongoose.Schema({
  bchAddresses: []
})

// export default mongoose.model('user', User)
module.exports = mongoose.model('bchAddressModel', bchAddressModel)
