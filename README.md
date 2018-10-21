# BCH Testnet Faucet
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

The code in this repository creates a minimalistic testnet faucet, used to distribute
testnet coins to developers who need them.

The testnet is composed of a minimalist font end single page app (SPA) using
jQuery. The back end is a Koa API server based on
[this koa2 boilerplate](https://github.com/christroutner/babel-free-koa2-api-boilerplate).
The BCH wallet functionality is implemented by [BITBOX](https://developer.bitcoin.com/bitbox),
and the testnet donations come from [Bitcoin.com](https://developer.bitcoin.com).

## Requirements
* node __^8.9.4__
* npm __^5.7.1__

## License
MIT
