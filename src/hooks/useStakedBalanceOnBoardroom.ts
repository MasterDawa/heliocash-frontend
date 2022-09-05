import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useHelioFinance from './useHelioFinance';
import useRefresh from './useRefresh';

const useStakedBalanceOnBoardroom = () => {
  const {slowRefresh} = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const helioFinance = useHelioFinance();
  const isUnlocked = helioFinance?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await helioFinance.getStakedSharesOnBoardroom());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, helioFinance]);
  return balance;
};

export default useStakedBalanceOnBoardroom;
