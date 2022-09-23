import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useRespectFinance from './useRespectFinance';
import useRefresh from './useRefresh';

const useTotalStakedOnBoardroom = () => {
  const [totalStaked, setTotalStaked] = useState(BigNumber.from(0));
  const respectFinance = useRespectFinance();
  const {slowRefresh} = useRefresh();
  const isUnlocked = respectFinance?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        setTotalStaked(await respectFinance.getTotalStakedInBoardroom());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      fetchTotalStaked();
    }
  }, [isUnlocked, slowRefresh, respectFinance]);

  return totalStaked;
};

export default useTotalStakedOnBoardroom;
