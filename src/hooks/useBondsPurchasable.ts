import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useHelioFinance from './useHelioFinance';

const useBondsPurchasable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
      try {
        setBalance(await helioFinance.getBondsPurchasable()); // 
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsPurchasable();
  }, [setBalance, helioFinance]);

  return balance;
};

export default useBondsPurchasable;
