import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useRespectFinance from './useRespectFinance';
import useRefresh from './useRefresh';

const useEarningsOnBoardroom = () => {
  const {slowRefresh} = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const respectFinance = useRespectFinance();
  const isUnlocked = respectFinance?.isUnlocked;

  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await respectFinance.getEarningsOnBoardroom());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [isUnlocked, respectFinance, slowRefresh]);

  return balance;
};

export default useEarningsOnBoardroom;
