import { task } from 'hardhat/config'

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

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
