const bchAddresses = require('../../models/bch-addresses')
const ipAddresses = require('../../models/ip-addresses')

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

    const bchAddr = ctx.params.bchaddr

    // Check if IP Address already exists in the database.
    const ipIsKnown = await checkIPAddress(ip)

    // Check if the BCH address already exists in the database.
    const bchIsKnown = await checkBchAddress(bchAddr)

    // If either are true, deny request.
    if (ipIsKnown || bchIsKnown || true) {
      ctx.body = {
        success: false,
        message: 'IP or Address found in DB'
      }
      // ctx.throw(401, 'IP or Address found in DB')
      return
    }

    // Add IP and BCH address to DB.

    // Otherewise sent the payment.

    // Respond with success.
    ctx.body = { success: true }

    /*
    const user = await User.findById(ctx.params.id, '-password')
    if (!user) {
      ctx.throw(404)
    }

    ctx.body = {
      user
    }
    */
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
    const existingIp = await ipAddresses.findOne({ ipAddress: ip })

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
    const existingAddr = await bchAddresses.findOne({ bchAddress: bchAddr })

    if (existingAddr) return true

    return false
  } catch (err) {
    console.log(`Error in checkBchAddress.`)
    throw err
  }
}
