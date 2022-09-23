import {useEffect, useState} from 'react';
import userespectFinance from './useRespectFinance';
import {LPStat} from '../respect-finance/types';
import useRefresh from './useRefresh';

const useLpStats = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const {slowRefresh} = useRefresh();
  const respectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try {
        setStat(await respectFinance.getLPStat(lpTicker));
      } catch (err) {
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, respectFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStats;
