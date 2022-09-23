import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import useRefresh from './useRefresh';

const useMaticStats = () => {
  const [stat, setStat] = useState<string>();
  const {slowRefresh} = useRefresh();
  const respectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await respectFinance.getWMATICPriceFromQuickswap());
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, respectFinance, slowRefresh]);

  return stat;
};

export default useMaticStats;
