# BCH Testnet Faucet
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

The code in this repository creates a minimalistic testnet faucet, used to distribute
testnet coins to developers who need them.

The faucet is composed of a minimalist font end single page app (SPA) using
jQuery. The back end is a Koa API server based on
[this koa2 boilerplate](https://github.com/christroutner/babel-free-koa2-api-boilerplate).
The BCH wallet functionality is implemented by [BITBOX](https://developer.bitcoin.com/bitbox),
and the testnet donations come from [Bitcoin.com](https://developer.bitcoin.com).

This application expects a `wallet.json` file in the root directory. This contains
the mnemonic seed required to access the funds the faucet will distribute. You can
generate a wallet using [this BITBOX example]()

## Requirements
* node __^8.9.4__
* npm __^5.7.1__

## License
MIT

## Docker
The `package.json` file includes scripts to build and run a Docker container for
this app.

- `npm run build` will build the Docker container. Note: It does not include the
  `--no-cache` flag which will build without a cache.

- `npm run docker` will run the Docker container. It assumes port 3000, so change this
  to whatever port you want to expose the server to. The format is
  `<host port>:<container port>`
