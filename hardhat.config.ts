/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// import * as dotenv from 'dotenv'
// dotenv.config()

import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-gas-reporter'
import './hardhat/tasks'

module.exports = {
  solidity: '0.8.0',
  settings: {
    optimizer: {
      enabled: true,
      runs: 5
    }
  },
  paths: {
    sources: './contracts',
    tests: './hardhat/tests',
    cache: './hardhat/cache',
    artifacts: './hardhat/artifacts'
  }
}
