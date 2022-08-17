import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import {LPStat} from '../helio-finance/types';
import useRefresh from './useRefresh';

const useLpStatsETH = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const {slowRefresh} = useRefresh();
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try {
        setStat(await helioFinance.getLPStatETH(lpTicker));
      } catch (err) {
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, helioFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStatsETH;
