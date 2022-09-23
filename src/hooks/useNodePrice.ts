import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import useRespectFinance from './useRespectFinance';
import { ContractName } from '../respect-finance';
import config from '../config';

const useNodePrice = (poolName: ContractName, poolId: Number, sectionInUI: Number) => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const respectFinance = useRespectFinance();

  const fetchAmount = useCallback(async () => {
    const balance = sectionInUI === 3 ? await respectFinance.getNodePrice(poolName, poolId) : BigNumber.from(0);
    setAmount(balance);
  }, [poolName, poolId, sectionInUI, respectFinance]);

  useEffect(() => {
    if (sectionInUI === 3) {
      fetchAmount().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchAmount, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [poolName, setAmount, respectFinance, fetchAmount]);

  return amount;
};

export default useNodePrice;
