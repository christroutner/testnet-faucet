// Instantiate the models.
const BchAddresses = require('../../models/bch-addresses')
const IpAddresses = require('../../models/ip-addresses')

const wallet = require('../../utils/wallet.js')

/**
 * @api {get} /users/:id Get user by id
 * @apiPermission user
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   users           User object
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      User name
 * @apiSuccess {String}   users.username  User username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "username": "johndoe"
 *       }
 *     }
 *
 * @apiUse TokenError
 */
async function getCoins (ctx, next) {
  try {
    // Get the IP of the requester.
    const ip = ctx.request.ip // Normal usage
    // const ip = this.request.headers["X-Orig-IP"] // If behind a reverse proxy
    console.log(
      `ctx.request.ip: ${ctx.request.ip}, header IP: ${
        ctx.request.headers['X-Orig-IP']
      }`
    )

    const bchAddr = ctx.params.bchaddr

    // Check if IP Address already exists in the database.
    const ipIsKnown = await checkIPAddress(ip)

    // Check if the BCH address already exists in the database.
    const bchIsKnown = await checkBchAddress(bchAddr)

    // If either are true, deny request.
    if (ipIsKnown || bchIsKnown) {
      ctx.body = {
        success: false,
        message: 'IP or Address found in DB'
      }
      return
    }

    // Otherewise sent the payment.
    const txid = await wallet.sendBCH(bchAddr)
    if (!txid) {
      ctx.body = {
        success: false,
        message: 'Invalid BCH cash address.'
      }
      return
    }

    // Add IP and BCH address to DB.
    await saveIp(ip)
    await saveAddr(bchAddr)

    // Respond with success.
    ctx.body = {
      success: true,
      txid: txid
    }
  } catch (err) {
    console.log(`Error in getCoins: `, err)

    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }

  if (next) {
    return next()
  }
}

module.exports = {
  getCoins
}

// Checks if the IP address exists in the DB. Returns true or false.
async function checkIPAddress (ip) {
  try {
    const existingIp = await IpAddresses.findOne({ ipAddress: ip })

    if (existingIp) return true

    return false
  } catch (err) {
    console.log(`Error in checkIPAddress.`)
    throw err
  }
}

// Checks if the BCH address exists in the DB. Returns true or false.
async function checkBchAddress (bchAddr) {
  try {
    const existingAddr = await BchAddresses.findOne({ bchAddress: bchAddr })

    if (existingAddr) return true

    return false
  } catch (err) {
    console.log(`Error in checkBchAddress.`)
    throw err
  }
}

// Saves the IP address to the database.
async function saveIp (ip) {
  try {
    const newIp = new IpAddresses()

    newIp.ipAddress = ip

    const now = new Date()
    const timestamp = now.toISOString()
    newIp.timestamp = timestamp

    await newIp.save()
  } catch (err) {
    console.log(`Error in saveIp().`)
    throw err
  }
}

// Saves the BCH address to the database.
async function saveAddr (bchAddr) {
  try {
    const newAddr = new BchAddresses()

    newAddr.bchAddress = bchAddr

    await newAddr.save()
  } catch (err) {
    console.log(`Error in saveAddr().`)
    throw err
  }
}
