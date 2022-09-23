import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import {TokenStat} from '../respect-finance/types';
import useRefresh from './useRefresh';

const useRespectStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const {fastRefresh} = useRefresh();
  const respectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchRespectPrice() {
      try {
        setStat(await respectFinance.getRespectStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchRespectPrice();
  }, [setStat, respectFinance, fastRefresh]);

  return stat;
};

export default userespectStats;
