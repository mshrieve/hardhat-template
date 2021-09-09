import { task } from 'hardhat/config'

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

task('getAccount', 'Prints the primary account', async (args, { ethers }) => {
  const [owner] = await ethers.getSigners()

  console.log(await owner.address)
})

task(
  'getBalance',
  'get balance of primary account',
  async (args, { ethers }) => {
    const [owner] = await ethers.getSigners()
    const balance = await owner.getBalance()
    console.log(ethers.utils.formatEther(balance))
  }
)

task(
  'randomWallet',
  'generate random private key',
  async (args, { ethers }) => {
    const wallet = ethers.Wallet.createRandom()
    console.log(wallet.privateKey)
  }
)
task('intervalMining', 'enable interval mining (for hardhat localhost)')
  .addParam('interval', 'the time in between blocks')
  .setAction(async (args, { network }) => {
    await network.provider.send('evm_setIntervalMining', [
      Number.parseInt(args.interval)
    ])
  })

task('autoMining', 'enable interval mining (for hardhat localhost)')
  .addParam('interval', 'the time in between blocks')
  .setAction(async (args, { network }) => {
    await network.provider.send('evm_setAutomine', [true])
  })
