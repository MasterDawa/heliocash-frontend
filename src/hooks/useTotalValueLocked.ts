import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import useRefresh from './useRefresh';

const useTotalValueLocked = () => {
  const [totalValueLocked, setTotalValueLocked] = useState<Number>(0);
  const {slowRefresh} = useRefresh();
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotalValueLocked(await helioFinance.getTotalValueLocked());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotalValueLocked, helioFinance, slowRefresh]);

  return totalValueLocked;
};

export default useTotalValueLocked;
