import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import useHelioFinance from './useHelioFinance';
import { ContractName } from '../helio-finance';
import config from '../config';

const useNodePrice = (poolName: ContractName, poolId: Number, sectionInUI: Number) => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const helioFinance = useHelioFinance();

  const fetchAmount = useCallback(async () => {
    const balance = sectionInUI === 3 ? await helioFinance.getNodePrice(poolName, poolId) : BigNumber.from(0);
    setAmount(balance);
  }, [poolName, poolId, sectionInUI, helioFinance]);

  useEffect(() => {
    if (sectionInUI === 3) {
      fetchAmount().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchAmount, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [poolName, setAmount, helioFinance, fetchAmount]);

  return amount;
};

export default useNodePrice;
