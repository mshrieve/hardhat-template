import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef
} from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import ethProvider from 'eth-provider'
import WalletConnectProvider from '@walletconnect/web3-provider'

interface Disconnectable {
  disconnect?: () => void
  removeAllListeners: () => void
}

// web3modal options
const providerOptions = {
  frame: {
    package: ethProvider,
    interval: 10
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY
    }
  }
}

// context state
const defaultState = {
  signer: undefined,
  provider: new ethers.providers.InfuraProvider(
    'rinkeby',
    process.env.NEXT_PUBLIC_INFURA_API_KEY
  ) as ethers.providers.Provider,
  address: undefined,
  connectWeb3: undefined,
  disconnectWeb3: undefined,
  chainId: 4,
  connected: false
}

const EthContext = createContext(defaultState)
const EthProvider: React.FC = ({ children }) => {
  const [state, setState] = useState(defaultState)
  const [userProvider, setUserProvider] =
    useState<ethers.providers.Web3Provider>(undefined)

  // set up web3 modal
  // do this in an effect otherwise window won't be available
  const web3Modal = useRef<Web3Modal>(null)
  useEffect(() => {
    web3Modal.current = new Web3Modal({
      network: 'rinkeby',
      // disableInjectedProvider: true,
      cacheProvider: false,
      providerOptions
    })
  }, [])

  // initial log-in
  useEffect(() => {
    // only login if there is a cached provider
    if (web3Modal.current.cachedProvider) {
      connectWeb3()
    }
  }, [])

  // connect method
  const connectWeb3 = useCallback(async () => {
    console.log('login web3')
    if (!web3Modal) return
    try {
      const web3Provider = await web3Modal.current.connect()

      // EXTERNAL PROVIDER EVENTS
      web3Provider.on('connect', () => {
        console.log('connect')
      })
      web3Provider.on('chainChanged', (chainId: number) => {
        console.log(`chain changed to ${chainId}`)
        setUserProvider(new ethers.providers.Web3Provider(web3Provider))
      })
      web3Provider.on('accountsChanged', () => {
        console.log(`account changed`)
        setUserProvider(new ethers.providers.Web3Provider(web3Provider))
      })
      web3Provider.on('disconnect', (code: string, reason: string) => {
        console.log('disconnect event')
        disconnectWeb3()
      })

      // ethers provider
      const userProvider = new ethers.providers.Web3Provider(web3Provider)
      // wait for provider to connect
      await userProvider.ready
      setUserProvider(userProvider)
    } catch (e) {
      console.log('web3modal error', e)
      // await web3Modal.current.clearCachedProvider()
    }
  }, [setUserProvider])

  // useEffect(() => {
  //   if (!provider) return setState(defaultState)
  //   console.log('waiting for provider')

  //   // ETHERS PROVIDER EVENTS
  //   // provider.on('network', (oldNetwork, newNetwork) =>
  //   //   console.log('network changed: ', newNetwork)
  //   // )

  //   // provider.on('block', (blockNumber: number) => {
  //   //   setState({ ...state, blockNumber })
  //   // })
  // }, [provider, setState, setProvider])

  // disconnect method
  const disconnectWeb3 = async () => {
    await web3Modal.current.clearCachedProvider()
    if (userProvider?.provider) {
      const web3Provider = userProvider.provider as Disconnectable

      web3Provider.removeAllListeners()
      if (typeof web3Provider.disconnect === 'function') {
        await web3Provider.disconnect()
      }
    }
    setState(defaultState)
  }

  const handleUserProvider = async (
    userProvider: ethers.providers.Web3Provider
  ) => {
    if (userProvider) {
      const network = await userProvider.getNetwork()
      // network is good
      if (network.chainId.toString() === process.env.NEXT_PUBLIC_CHAIN_ID) {
        const signer = userProvider.getSigner()
        const address = await signer.getAddress()
        return setState({
          ...state,
          provider: userProvider,
          signer,
          address,
          chainId: network.chainId,
          connected: true
        })
      }
      // network is not good
      return setState({ ...defaultState, chainId: network.chainId })
    }
    // no userProvider
    return setState(defaultState)
  }

  // whenever userProvider updates
  useEffect(() => {
    handleUserProvider(userProvider)
  }, [userProvider])

  return (
    <EthContext.Provider
      value={{
        ...state,
        connectWeb3,
        disconnectWeb3
      }}
    >
      {children}
    </EthContext.Provider>
  )
}
const useEth = () => useContext(EthContext)

export { EthContext, EthProvider, useEth }
