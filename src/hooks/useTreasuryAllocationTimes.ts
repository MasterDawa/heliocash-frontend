import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import {AllocationTime} from '../helio-finance/types';
import useRefresh from './useRefresh';

const useTreasuryAllocationTimes = () => {
  const {slowRefresh} = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const helioFinance = useHelioFinance();
  useEffect(() => {
    if (helioFinance) {
      helioFinance.getTreasuryNextAllocationTime().then(setTime);
    }
  }, [helioFinance, slowRefresh]);
  return time;
};

export default useTreasuryAllocationTimes;
