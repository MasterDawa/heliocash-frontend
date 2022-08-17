import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import useRefresh from './useRefresh';

const useMaticStats = () => {
  const [stat, setStat] = useState<string>();
  const {slowRefresh} = useRefresh();
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await helioFinance.getWMATICPriceFromQuickswap());
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, helioFinance, slowRefresh]);

  return stat;
};

export default useMaticStats;
