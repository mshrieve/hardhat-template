/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// import * as dotenv from 'dotenv'
// dotenv.config()

import '@typechain/hardhat'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import './tasks'

module.exports = {
  solidity: '0.8.0',
  etherscan: {
    // comment out if not using
    // apiKey: process.env.ETHERSCAN_API_KEY
  },
  networks: {
    rinkeby: {
      // url: process.env.ALCHEMY_RINKEBY_ENDPOINT,
      // accounts: [process.env.RINKEBY_PRIVATE_KEY]
    }
  },
  typechain: {
    outDir: './types',
    target: 'ethers-v5'
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 5
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  }
}
