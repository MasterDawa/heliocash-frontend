import { useEffect, useState, useMemo } from 'react';

import {BigNumber} from 'ethers';
import useRespectFinance from './useRespectFinance';
import {ContractName} from '../respect-finance';

const useClaimedBalance = (poolName: ContractName, sectionInUI: Number, account: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const respectFinance = useRespectFinance();

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await respectFinance.claimedBalanceNode(poolName, account) 
      setBalance(res)
    }

    if (account && sectionInUI === 3 && respectFinance && poolName) {
      fetchBalance();
    }
  }, [account, poolName, setBalance, respectFinance, sectionInUI]);

  return balance;
};

export default useClaimedBalance;
