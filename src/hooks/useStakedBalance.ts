import { useCallback, useEffect, useState, useMemo } from 'react';

import {BigNumber} from 'ethers';
import useHelioFinance from './useHelioFinance';
import {ContractName} from '../helio-finance';
import config from '../config';

const useStakedBalance = (poolName: ContractName, poolId: Number, sectionInUI: Number, account: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const helioFinance = useHelioFinance();

  const fetchBalance = useCallback(async () => {
    const balance = await helioFinance.stakedBalanceOnBank(poolName, poolId, sectionInUI, account);
    setBalance(balance);
  }, [poolName, poolId, sectionInUI, account, helioFinance]);

  useEffect(() => {
    if (account) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [account, poolName, helioFinance, sectionInUI, fetchBalance]);

  return balance;
};

export default useStakedBalance;
