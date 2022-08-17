import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import {TokenStat} from '../helio-finance/types';
import useRefresh from './useRefresh';

const useShareStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const {slowRefresh} = useRefresh();
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await helioFinance.getShareStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, helioFinance, slowRefresh]);

  return stat;
};

export default useShareStats;
