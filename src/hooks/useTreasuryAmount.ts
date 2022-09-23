import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useRespectFinance from './useRespectFinance';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const respectFinance = useRespectFinance();

  useEffect(() => {
    if (respectFinance) {
      const {Treasury} = respectFinance.contracts;
      respectFinance.RESPECT.balanceOf(Treasury.address).then(setAmount);
    }
  }, [respectFinance]);
  return amount;
};

export default useTreasuryAmount;
