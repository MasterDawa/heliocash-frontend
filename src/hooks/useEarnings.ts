import {useCallback, useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useHelioFinance from './useHelioFinance';
import {ContractName} from '../helio-finance';
import config from '../config';

const useEarnings = (poolName: ContractName, earnTokenName: String, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const helioFinance = useHelioFinance();
  const isUnlocked = helioFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await helioFinance.earnedFromBank(poolName, earnTokenName, poolId, helioFinance.myAccount);
    setBalance(balance);
  }, [poolName, earnTokenName, poolId, helioFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, helioFinance, fetchBalance]);

  return balance;
};

export default useEarnings;
