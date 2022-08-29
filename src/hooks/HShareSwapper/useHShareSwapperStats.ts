import {useEffect, useState} from 'react';
import useHelioFinance from '../useHelioFinance';
import {HShareSwapperStat} from '../../helio-finance/types';
import useRefresh from '../useRefresh';

const useHShareSwapperStats = (account: string) => {
  const [stat, setStat] = useState<HShareSwapperStat>();
  const {fastRefresh /*, slowRefresh*/} = useRefresh();
  const helioFinance = useHelioFinance();

  useEffect(() => {
    async function fetchHShareSwapperStat() {
      try {
        if (helioFinance.myAccount) {
          setStat(await helioFinance.getHShareSwapperStat(account));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchHShareSwapperStat();
  }, [setStat, helioFinance, fastRefresh, account]);

  return stat;
};

export default useHShareSwapperStats;
