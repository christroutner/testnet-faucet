/*
  This library handles all the wallet functionality.
*/

// Inspect utility used for debugging.
const util = require('util')
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

const BB = require('bitbox-sdk/lib/bitbox-sdk').default
const BITBOX = new BB({restURL: `https://trest.bitcoin.com/v1/`})

module.exports = {
  consolidateUTXOs
}

async function consolidateUTXOs () {
  console.log('hello world')
}
