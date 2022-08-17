import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import {TokenStat} from '../helio-finance/types';
import useRefresh from './useRefresh';

const useHelioStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const {fastRefresh} = useRefresh();
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchHelioPrice() {
      try {
        setStat(await helioFinance.getHelioStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchHelioPrice();
  }, [setStat, helioFinance, fastRefresh]);

  return stat;
};

export default useHelioStats;
