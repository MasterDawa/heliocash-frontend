import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import useRefresh from './useRefresh';

const useTotalValueLocked = () => {
  const [totalValueLocked, setTotalValueLocked] = useState<Number>(0);
  const {slowRefresh} = useRefresh();
  const respectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotalValueLocked(await respectFinance.getTotalValueLocked());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotalValueLocked, respectFinance, slowRefresh]);

  return totalValueLocked;
};

export default useTotalValueLocked;
