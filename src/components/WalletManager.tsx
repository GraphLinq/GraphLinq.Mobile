import React, { useEffect } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import Option from "./Button/Option";

import { useDispatch } from "react-redux";
import {
  OPEN_MODAL,
  CLOSE_MODAL,
  ACCOUNT_UPDATE,
} from "../redux/actions/index";

import {REACT_APP_SIGN_KEY} from '@env';

import { SUPPORTED_WALLETS } from "../constants/index";
import WalletService from "../services/walletService";
import Web3 from "web3";

const WalletManager = (props: any) => {

    const dispatch = useDispatch();

    const { account, connector, activate } = useWeb3React();

    useEffect(() => {
        if (!account) { return }
        if (WalletService.verifySessionIntegrity(account)) {
          {props.onPageChanged('Home')}
          return
        }
        (async () => {
            console.log(activate)
            let web3: any = undefined
            let signature: string = ""
            if ((window as any).ethereum !== undefined) {
              web3 = new Web3((window as any).ethereum)
              try {
                signature = await web3.eth.personal.sign(REACT_APP_SIGN_KEY, account, "")
              } catch (e) { console.error(e) }
            }

            const result = await WalletService.authWallet(account, signature)

            if (result) {
              dispatch({
                name: "walletManager",
                type: ACCOUNT_UPDATE,
                payload: {
                  account,
                },
              });
              {props.onPageChanged('Home')}
            }
        })()
    }, [account])

  const tryActivation = async (connector: any) => {
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === (SUPPORTED_WALLETS as any)[key].connector) {
        return (SUPPORTED_WALLETS as any)[key].name;
      }
      return true;
    });

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector); // a little janky...can't use setError because the connector isn't set
        }
      });
  };

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask =
      (window as any).ethereum && (window as any).ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = (SUPPORTED_WALLETS as any)[key];
        if (
          !(window as any).web3 &&
          !(window as any).ethereum &&
          option.mobile
        ) {
          return (
            <Option
              onClick={() => {
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector);
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              link={option.href}
              header={option.name}
              icon={option.iconName}
            />
          );
        }
      });
  }

  function getContent() {
    return (
      <>
        {getOptions()}
      </>
    );
  }

  return <>{getContent()}</>;
}

export default WalletManager;
