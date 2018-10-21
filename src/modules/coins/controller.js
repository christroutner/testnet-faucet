// Instantiate the models.
const BchAddresses = require("../../models/bch-addresses")
const IpAddresses = require("../../models/ip-addresses")

const wallet = require("../../utils/wallet.js")

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Sends coins to the user.
async function getCoins(ctx, next) {
  try {
    // Get the IP of the requester.
    const ip = ctx.request.ip // Normal usage
    const ipAlt = ctx.request.headers["X-Real-IP"] // If behind a reverse proxy
    console.log(`ipAlt: ${ipAlt}`)
    console.log(`ctx.request.headers: ${util.inspect(ctx.request.headers)}`)

    const bchAddr = ctx.params.bchaddr

    console.log(`Requesting IP: ${ip}, Address: ${bchAddr}`)

    // Check if IP Address already exists in the database.
    const ipIsKnown = await checkIPAddress(ip)

    // Check if the BCH address already exists in the database.
    const bchIsKnown = await checkBchAddress(bchAddr)

    // If either are true, deny request.
    if (ipIsKnown || bchIsKnown) {
      ctx.body = {
        success: false,
        message: "IP or Address found in DB"
      }
      console.log(`Rejected due to repeat BCH or IP address.`)
      return
    }

    // Otherewise sent the payment.
    const txid = await wallet.sendBCH(bchAddr)
    if (!txid) {
      ctx.body = {
        success: false,
        message: "Invalid BCH cash address."
      }
      console.log(`Rejected because invalid BCH testnet address.`)
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

    if (err === 404 || err.name === "CastError") ctx.throw(404)

    ctx.throw(500)
  }

  if (next) return next()
}

module.exports = {
  getCoins
}

// Checks if the IP address exists in the DB. Returns true or false.
async function checkIPAddress(ip) {
  try {
    const existingIp = await IpAddresses.findOne({ ipAddress: ip.toString() })

    if (existingIp) return true

    return false
  } catch (err) {
    console.log(`Error in checkIPAddress.`)
    throw err
  }
}

// Checks if the BCH address exists in the DB. Returns true or false.
async function checkBchAddress(bchAddr) {
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
async function saveIp(ip) {
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
async function saveAddr(bchAddr) {
  try {
    const newAddr = new BchAddresses()

    newAddr.bchAddress = bchAddr

    await newAddr.save()
  } catch (err) {
    console.log(`Error in saveAddr().`)
    throw err
  }
}
