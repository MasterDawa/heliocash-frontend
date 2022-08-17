import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import useRefresh from './useRefresh';

const useEthStats = () => {
  const [stat, setStat] = useState<Number>();
  const {slowRefresh} = useRefresh();
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await helioFinance.getETHPriceUSD());
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, helioFinance, slowRefresh]);

  return stat;
};

export default useEthStats;
