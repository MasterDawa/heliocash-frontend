import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useHelioFinance from './useHelioFinance';

const useBondsPurchasable = (version: number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
      try {
        setBalance(await helioFinance.getBondsPurchasable(version)); // 
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsPurchasable();
  }, [setBalance, helioFinance, version]);

  return balance;
};

export default useBondsPurchasable;
