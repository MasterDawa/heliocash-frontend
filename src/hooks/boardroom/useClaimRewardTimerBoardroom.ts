import {useEffect, useState} from 'react';
import useHelioFinance from '../useHelioFinance';
import {AllocationTime} from '../../helio-finance/types';

const useClaimRewardTimerBoardroom = (version: number) => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const helioFinance = useHelioFinance();

  useEffect(() => {
    if (helioFinance) {
      helioFinance.getUserClaimRewardTime(version).then(setTime);
    }
  }, [helioFinance, version]);
  return time;
};

export default useClaimRewardTimerBoardroom;
