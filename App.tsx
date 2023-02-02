import React, { useState} from "react";
import { NativeBaseProvider } from "native-base";
import {Provider} from 'react-redux';
import { store } from "./src/redux/store";

import { useActiveWeb3React } from "./src/hooks";
import Web3ReactManager from "./src/web3/web3Manager";
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';

import { NetworkContextName } from './src/constants/index';
import getLibrary from './src/utils/getLibrary';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);
import theme from './src/theme'
;
import Auth from "./src/pages/Auth";
import Home from "./src/pages/Home";

if ('ethereum' in window) {
  (window as any).ethereum.autoRefreshOnNetworkChange = false;
}

const AppWrapper = () => {

  useActiveWeb3React();

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App= () => {

  const [pageType, setPageType] = useState('Auth');

  const onPageChanged = (type: any) => {
    setPageType(type);
  }

  return (
     <Web3ReactProvider getLibrary={getLibrary}>
       <Web3ProviderNetwork getLibrary={getLibrary}>
        <NativeBaseProvider theme={theme}>
            <Web3ReactManager>
                {pageType=='Auth'?
              <Auth onPageChanged={onPageChanged}/>
              : pageType=='Home'?
              <Home onPageChanged={onPageChanged}/>
              : null
              }
            </Web3ReactManager>
        </NativeBaseProvider>
       </Web3ProviderNetwork>
     </Web3ReactProvider>
  );
};

export default AppWrapper;
