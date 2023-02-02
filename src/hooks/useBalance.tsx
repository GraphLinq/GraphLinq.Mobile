import { useCallback } from 'react';
import "@ethersproject/shims";
import { useDispatch, useSelector } from 'react-redux';
import { utils } from 'ethers';
import { UPDATE_BALANCE } from '../redux/actions/index';
import { useActiveWeb3React } from '.';
import { useTokenContract } from './useContract';

import {REACT_APP_GRAPHLINQ_TOKEN_CONTRACT} from "@env"

export function useBalance() {
  const { account } = useActiveWeb3React()

  const dispatch = useDispatch();
  
  const balance = useSelector(state => (state as any).modals.balance);

  const tokenContract = useTokenContract(REACT_APP_GRAPHLINQ_TOKEN_CONTRACT);

  const refreshBalance = useCallback(async () => {
      if (!account || !tokenContract) {
        return;
      }
      try {
      const balanceOf = await tokenContract.balanceOf(account);
      console.log("Token: ", tokenContract);
      console.log("Account: ", account);
      if (!balanceOf) return;
  
      const balance = parseFloat(utils.formatUnits(balanceOf, 18));
      console.log("balance:", balance);
      dispatch({ type: UPDATE_BALANCE, payload: {balance}, name: 'balance'});
      } catch (e) { console.error(e) }

  }, [account, tokenContract]);

 return { balance, refreshBalance }
}
