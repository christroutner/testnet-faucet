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
This server requires a Mongo database, so it uses Docker Compose to run in production.
[This tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)
shows how to setup Docker.
[This tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04)
shows how to setup Docker Compose. Here are some commands to build and run this
application with Docker Compose:

- `docker-compose build --no-cache` will build the Docker container from scratch.
  If previously used, this will fail without first deleting the `database` folder,
  which is created with root privileges by Docker, so it must be deleted with the
  `sudo rm -rf database` command.

- `docker-compose up -d` will run the server in the background (daemon mode).
  The server attaches to port 3000 by default.
