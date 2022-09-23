import { useCallback, useEffect, useState, useMemo } from 'react';

import {BigNumber} from 'ethers';
import useRespectFinance from './useRespectFinance';
import {ContractName} from '../respect-finance';
import config from '../config';

const useStakedBalance = (poolName: ContractName, poolId: Number, sectionInUI: Number, account: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const respectFinance = useRespectFinance();

  const fetchBalance = useCallback(async () => {
    const balance = await respectFinance.stakedBalanceOnBank(poolName, poolId, sectionInUI, account);
    setBalance(balance);
  }, [poolName, poolId, sectionInUI, account, respectFinance]);

  useEffect(() => {
    if (account) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [account, poolName, respectFinance, sectionInUI, fetchBalance]);

  return balance;
};

export default useStakedBalance;
