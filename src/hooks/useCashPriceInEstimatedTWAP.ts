import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import {TokenStat} from '../helio-finance/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = (version: number) => {
  const [stat, setStat] = useState<TokenStat>();
  const helioFinance = useHelioFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await helioFinance.getHelioStatInEstimatedTWAP(version));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, helioFinance, slowRefresh, version]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
