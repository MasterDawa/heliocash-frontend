import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import {TokenStat} from '../helio-finance/types';
import useRefresh from './useRefresh';

const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const {slowRefresh} = useRefresh();
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchBondPrice() {
      try {
        setStat(await helioFinance.getBondStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondPrice();
  }, [setStat, helioFinance, slowRefresh]);

  return stat;
};

export default useBondStats;
