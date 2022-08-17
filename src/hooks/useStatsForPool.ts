import {useCallback, useState, useEffect} from 'react';
import useHelioFinance from './useHelioFinance';
import {Bank} from '../helio-finance';
import {PoolStats} from '../helio-finance/types';
import config from '../config';

const useStatsForPool = (bank: Bank) => {
  const helioFinance = useHelioFinance();

  const [poolAPRs, setPoolAPRs] = useState<PoolStats>();

  const fetchAPRsForPool = useCallback(async () => {
    setPoolAPRs(await helioFinance.getPoolAPRs(bank));
  }, [helioFinance, bank]);

  useEffect(() => {
    fetchAPRsForPool().catch((err) => console.error(`Failed to fetch APR info: ${err.stack}`));
    const refreshInterval = setInterval(fetchAPRsForPool, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPoolAPRs, helioFinance, fetchAPRsForPool]);

  return poolAPRs;
};

export default useStatsForPool;
