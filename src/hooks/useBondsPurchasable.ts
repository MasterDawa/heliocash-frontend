import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useRespectFinance from './useRespectFinance';

const useBondsPurchasable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const respectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
      try {
        setBalance(await respectFinance.getBondsPurchasable()); // 
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsPurchasable();
  }, [setBalance, respectFinance]);

  return balance;
};

export default useBondsPurchasable;
