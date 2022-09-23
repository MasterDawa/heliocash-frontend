import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import {AllocationTime} from '../respect-finance/types';
import useRefresh from './useRefresh';

const useTreasuryAllocationTimes = () => {
  const {slowRefresh} = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const respectFinance = useRespectFinance();
  useEffect(() => {
    if (respectFinance) {
      respectFinance.getTreasuryNextAllocationTime().then(setTime);
    }
  }, [respectFinance, slowRefresh]);
  return time;
};

export default useTreasuryAllocationTimes;
