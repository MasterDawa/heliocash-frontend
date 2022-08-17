import React, {createContext, useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';
import HelioFinance from '../../helio-finance';
import config from '../../config';

export interface HelioFinanceContext {
  helioFinance?: HelioFinance;
}

export const Context = createContext<HelioFinanceContext>({helioFinance: null});

export const HelioFinanceProvider: React.FC = ({children}) => {
  const {ethereum, account} = useWallet();
  const [helioFinance, setHelioFinance] = useState<HelioFinance>();

  useEffect(() => {
    if (!helioFinance) {
      const helio = new HelioFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        helio.unlockWallet(ethereum, account);
      }
      setHelioFinance(helio);
    } else if (account) {
      helioFinance.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, helioFinance]);

  return <Context.Provider value={{helioFinance}}>{children}</Context.Provider>;
};
