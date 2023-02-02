
import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 1337]
})

export const SUPPORTED_WALLETS = {
    INJECTED: {
      connector: injected,
      name: 'Injected',
      iconName: 'Icon',
      description: 'Injected web3 provider.',
      href: null,
      primary: true
    },
    METAMASK: {
      connector: injected,
      name: 'MetaMask',
      iconName: 'MetaMaskIcon',
      description: 'Easy-to-use browser extension.',
      href: null,
    },
  }
  
  export const NetworkContextName = 'NETWORK'