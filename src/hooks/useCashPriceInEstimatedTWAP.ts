import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import {TokenStat} from '../helio-finance/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = () => {
  const [stat, setStat] = useState<TokenStat>();
  const helioFinance = useHelioFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await helioFinance.getHelioStatInEstimatedTWAP());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, helioFinance, slowRefresh]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
