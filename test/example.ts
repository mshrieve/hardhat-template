import { ethers } from 'hardhat'
import { BigNumber, Contract, Signer } from 'ethers'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Interface } from 'ethers/lib/utils'

describe('Trie', function () {
  let Example: Contract
  let owner: SignerWithAddress
  let iface: Interface

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0]

    const ExampleFactory = await ethers.getContractFactory('Example')
    Example = await ExampleFactory.deploy()
    const ExampleInterface = ExampleFactory.interface
    await Example.deployed()

    iface = ExampleInterface
  })

  it('should return value', async function () {
    const value = await Example.value()

    expect(value.toString()).to.equal('1')
  })
})
