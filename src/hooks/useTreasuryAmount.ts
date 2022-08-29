import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useHelioFinance from './useHelioFinance';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const helioFinance = useHelioFinance();

  useEffect(() => {
    if (helioFinance) {
      const {Treasury} = helioFinance.contracts;
      helioFinance.HELIO.balanceOf(Treasury.address).then(setAmount);
    }
  }, [helioFinance]);
  return amount;
};

export default useTreasuryAmount;
