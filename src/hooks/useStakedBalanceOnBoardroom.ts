import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useRespectFinance from './useRespectFinance';
import useRefresh from './useRefresh';

const useStakedBalanceOnBoardroom = () => {
  const {slowRefresh} = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const respectFinance = useRespectFinance();
  const isUnlocked = respectFinance?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await respectFinance.getStakedSharesOnBoardroom());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, respectFinance]);
  return balance;
};

export default useStakedBalanceOnBoardroom;
