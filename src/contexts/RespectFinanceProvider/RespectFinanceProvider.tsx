import React, {createContext, useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';
import RespectFinance from '../../respect-finance';
import config from '../../config';

export interface RespectFinanceContext {
  helioFinance?: RespectFinance;
}

export const Context = createContext<RespectFinanceContext>({respectFinance: null});

export const RespectFinanceProvider: React.FC = ({children}) => {
  const {ethereum, account} = useWallet();
  const [respectFinance, setRespectFinance] = useState<RespectFinance>();

  useEffect(() => {
    if (!respectFinance) {
      const helio = new RespectFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        respect.unlockWallet(ethereum, account);
      }
      setRespectFinance(respect);
    } else if (account) {
      respectFinance.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, respectFinance]);

  return <Context.Provider value={{respectFinance}}>{children}</Context.Provider>;
};
