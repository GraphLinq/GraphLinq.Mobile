import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { PortisConnector } from '@web3-react/portis-connector';

import { NetworkConnector } from './networkConnector';

import { BscConnector } from '@binance-chain/bsc-connector'

import {REACT_APP_GLQ_CHAIN_ID, REACT_APP_NETWORK_URL, REACT_APP_FORTMATIC_KEY, REACT_APP_PORTIS_ID, REACT_APP_CHAIN_ID} from '@env';

const NETWORK_URL = REACT_APP_NETWORK_URL
const FORMATIC_KEY = REACT_APP_FORTMATIC_KEY
const PORTIS_ID = REACT_APP_PORTIS_ID

export const NETWORK_CHAIN_ID = parseInt(REACT_APP_CHAIN_ID ?? '1')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: any
export function getNetworkLibrary() {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider))
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 5, parseInt(REACT_APP_GLQ_CHAIN_ID), 1337] // @TODO remove goerli
})

export const bsc = new BscConnector({
  supportedChainIds: [56, 97] // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'GraphLinq',
  darkMode: true,
  appLogoUrl:
      'https://pbs.twimg.com/profile_images/1377306271280336899/rI5w2g-v_400x400.jpg'
})
