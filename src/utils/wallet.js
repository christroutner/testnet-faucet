/*
  This library handles all the wallet functionality.
*/

module.exports = {
  consolidateUTXOs
}

// Inspect utility used for debugging.
const util = require('util')
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

const BB = require('bitbox-sdk/lib/bitbox-sdk').default
const BITBOX = new BB({restURL: `https://trest.bitcoin.com/v1/`})

const walletInfo = require(`../../wallet.json`)

async function consolidateUTXOs () {
  const mnemonic = walletInfo.mnemonic

  // root seed buffer
  const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)

  // master HDNode
  const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, 'testnet') // Testnet

  // HDNode of BIP44 account
  const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

  const change = BITBOX.HDNode.derivePath(account, '0/0')

  // get the cash address
  const cashAddress = BITBOX.HDNode.toCashAddress(change)
  // const cashAddress = walletInfo.cashAddress

  // instance of transaction builder
  const transactionBuilder = new BITBOX.TransactionBuilder('testnet')

  // Combine all the utxos into the inputs of the TX.
  const u = await BITBOX.Address.utxo([cashAddress])
  const inputs = []
  let originalAmount = 0

  console.log(`Number of UTXOs: ${u[0].length}`)

  for (let i = 0; i < u[0].length; i++) {
    const thisUtxo = u[0][i]

    // Most UTXOs will come from mining rewards, so we need to wait 100
    // confirmations before we spend them.
    if (thisUtxo.confirmations > 100) {
      originalAmount = originalAmount + thisUtxo.satoshis
      inputs.push(thisUtxo)
      transactionBuilder.addInput(thisUtxo.txid, thisUtxo.vout)
    }

    // Can only do 20 UTXOs at a time.
    if (inputs.length > 19) break
  }

  // original amount of satoshis in vin
  console.log(`originalAmount: ${originalAmount}`)

  // get byte count to calculate fee. paying 1 sat/byte
  const byteCount = BITBOX.BitcoinCash.getByteCount(
    { P2PKH: inputs.length },
    { P2PKH: 1 }
  )
  console.log(`fee: ${byteCount}`)

  // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
  const sendAmount = originalAmount - byteCount
  console.log(`sendAmount: ${sendAmount}`)

  // add output w/ address and amount to send
  transactionBuilder.addOutput(cashAddress, sendAmount)

  // keypair
  const keyPair = BITBOX.HDNode.toKeyPair(change)

  // sign w/ HDNode
  let redeemScript
  inputs.forEach((input, index) => {
    // console.log(`inputs[${index}]: ${util.inspect(inputs[index])}`)
    transactionBuilder.sign(
      index,
      keyPair,
      redeemScript,
      transactionBuilder.hashTypes.SIGHASH_ALL,
      inputs[index].satoshis
    )
  })

  // build tx
  const tx = transactionBuilder.build()

  // output rawhex
  const hex = tx.toHex()
  // console.log(`TX Hex: ${hex}`)

  // sendRawTransaction to running BCH node
  const broadcast = await BITBOX.RawTransactions.sendRawTransaction(hex)
  console.log(`\nConsolidating UTXOs. Transaction ID: ${broadcast}`)
}
