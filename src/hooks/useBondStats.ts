import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import {TokenStat} from '../helio-finance/types';
import useRefresh from './useRefresh';

const useBondStats = (version: number) => {
  const [stat, setStat] = useState<TokenStat>();
  const {slowRefresh} = useRefresh();
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchBondPrice() {
      try {
        setStat(await helioFinance.getBondStat(version));
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondPrice();
  }, [setStat, helioFinance, slowRefresh, version]);

  return stat;
};

export default useBondStats;
