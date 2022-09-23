import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import {TokenStat} from '../respect-finance/types';
import useRefresh from './useRefresh';

const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const {slowRefresh} = useRefresh();
  const respectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchBondPrice() {
      try {
        setStat(await respectFinance.getBondStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondPrice();
  }, [setStat, respectFinance, slowRefresh]);

  return stat;
};

export default useBondStats;
