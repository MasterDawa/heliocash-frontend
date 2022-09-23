import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import {LPStat} from '../respect-finance/types';
import useRefresh from './useRefresh';

const useLpStatsETH = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const {slowRefresh} = useRefresh();
  const RespectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try {
        setStat(await respectFinance.getLPStatETH(lpTicker));
      } catch (err) {
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, respectFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStatsETH;
