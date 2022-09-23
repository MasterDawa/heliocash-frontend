import {useEffect, useState} from 'react';
import useHelioFinance from '../useRespectFinance';
import {AllocationTime} from '../../respect-finance/types';

const useUnstakeTimerBoardroom = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const respectFinance = useRespectFinance();

  useEffect(() => {
    if (respectFinance) {
      respectFinance.getUserUnstakeTime().then(setTime);
    }
  }, [respectFinance]);
  return time;
};

export default useUnstakeTimerBoardroom;
