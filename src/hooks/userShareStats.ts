import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import {TokenStat} from '../respect-finance/types';
import useRefresh from './useRefresh';

const useShareStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const {slowRefresh} = useRefresh();
  const respectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await respectFinance.getShareStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, respectFinance, slowRefresh]);

  return stat;
};

export default useShareStats;
