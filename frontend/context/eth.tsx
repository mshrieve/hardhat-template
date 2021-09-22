import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect
} from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import ethProvider from 'eth-provider'

// WEB 3 MODAL
const providerOptions = {
  frame: {
    package: ethProvider // required
  }
}

// CONTEXT STATE
const defaultState = {
  signer: undefined,
  address: undefined,
  loginWeb3: undefined,
  logoutWeb3: undefined,
  chainId: 0,
  blockNumber: 0
}

const EthContext = createContext(defaultState)

const EthProvider: React.FC = ({ children }) => {
  const [web3Modal, setWeb3Modal] = useState(undefined)

  const [state, setState] = useState(defaultState)
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider>(undefined)

  // INIT WEB 3 MODAL
  // dev: we cant do this outside an effect bc window won't be defined in next.js
  useEffect(() => {
    setWeb3Modal(
      new Web3Modal({
        cacheProvider: true,
        providerOptions
      })
    )
  }, [])

  // set the provider and the signer
  // set up provider event subscriptions
  const loginWeb3 = useCallback(async () => {
    if (!web3Modal) return
    const web3Provider = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(web3Provider)
    const signer = provider.getSigner()
    const address = await signer.getAddress()

    // UPDATE STATE
    setState({ ...state, signer, address })
    setProvider(provider)

    // EXTERNAL PROVIDER EVENTS
    web3Provider.on('chainChanged', (chainId: number) => {
      console.log(`chain changed to ${chainId}`)
      setProvider(new ethers.providers.Web3Provider(web3Provider))
    })
    web3Provider.on('accountsChanged', () => {
      console.log(`account changed`)
      setProvider(new ethers.providers.Web3Provider(web3Provider))
    })
    web3Provider.on('disconnect', (code: string, reason: string) => {
      console.log(code, reason)
      logoutWeb3()
    })

    // ETHERS PROVIDER EVENTS
    provider.on('block', (blockNumber: number) => {
      setState({ ...state, blockNumber })
    })
  }, [web3Modal])

  // LOGOUT WALLET
  // dev: i used to test whether there was a disconnect function on provider.provider
  const logoutWeb3 = useCallback(async () => {
    if (!web3Modal) return
    await web3Modal.clearCachedProvider()
    setState(defaultState)

    setTimeout(() => {
      window.location.reload()
    }, 1)
  }, [web3Modal])

  // INITIAL AUTO-LOGIN
  useEffect(() => {
    console.log('login web3')
    loginWeb3()
  }, [web3Modal])

  return (
    <EthContext.Provider value={{ ...state }}>{children}</EthContext.Provider>
  )
}
const useEth = () => useContext(EthContext)

export { EthContext, EthProvider, useEth }
