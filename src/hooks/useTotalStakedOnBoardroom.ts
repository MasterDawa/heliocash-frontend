import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useHelioFinance from './useHelioFinance';
import useRefresh from './useRefresh';

const useTotalStakedOnBoardroom = () => {
  const [totalStaked, setTotalStaked] = useState(BigNumber.from(0));
  const helioFinance = useHelioFinance();
  const {slowRefresh} = useRefresh();
  const isUnlocked = helioFinance?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        setTotalStaked(await helioFinance.getTotalStakedInBoardroom());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      fetchTotalStaked();
    }
  }, [isUnlocked, slowRefresh, helioFinance]);

  return totalStaked;
};

export default useTotalStakedOnBoardroom;
