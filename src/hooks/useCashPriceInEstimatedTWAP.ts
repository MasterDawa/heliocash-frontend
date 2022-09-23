import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import {TokenStat} from '../respect-finance/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = () => {
  const [stat, setStat] = useState<TokenStat>();
  const respectFinance = useRespectFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await respectFinance.getRespectStatInEstimatedTWAP());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, respectFinance, slowRefresh]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
