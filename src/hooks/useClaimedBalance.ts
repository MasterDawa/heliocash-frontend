import { useEffect, useState, useMemo } from 'react';

import {BigNumber} from 'ethers';
import useHelioFinance from './useHelioFinance';
import {ContractName} from '../helio-finance';

const useClaimedBalance = (poolName: ContractName, sectionInUI: Number, account: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const helioFinance = useHelioFinance();

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await helioFinance.claimedBalanceNode(poolName, account) 
      setBalance(res)
    }

    if (account && sectionInUI === 3 && helioFinance && poolName) {
      fetchBalance();
    }
  }, [account, poolName, setBalance, helioFinance, sectionInUI]);

  return balance;
};

export default useClaimedBalance;
