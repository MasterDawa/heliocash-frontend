import {useCallback, useState, useEffect} from 'react';
import useRespectFinance from './useRespectFinance';
import {Bank} from '../respect-finance';
import {PoolStats} from '../respect-finance/types';
import config from '../config';

const useStatsForPool = (bank: Bank) => {
  const respectFinance = useRespectFinance();

  const [poolAPRs, setPoolAPRs] = useState<PoolStats>();

  const fetchAPRsForPool = useCallback(async () => {
    setPoolAPRs(await respectFinance.getPoolAPRs(bank));
  }, [respectFinance, bank]);

  useEffect(() => {
    fetchAPRsForPool().catch((err) => console.error(`Failed to fetch APR info: ${err.stack}`));
    const refreshInterval = setInterval(fetchAPRsForPool, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPoolAPRs, respectFinance, fetchAPRsForPool]);

  return poolAPRs;
};

export default useStatsForPool;
