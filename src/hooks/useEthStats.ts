import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import useRefresh from './useRefresh';

const useEthStats = () => {
  const [stat, setStat] = useState<Number>();
  const {slowRefresh} = useRefresh();
  const respectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await respectFinance.getETHPriceUSD());
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, respectFinance, slowRefresh]);

  return stat;
};

export default useEthStats;
