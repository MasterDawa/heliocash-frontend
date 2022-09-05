import {useCallback, useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import useStakedBalanceOnBoardroom from './useStakedBalanceOnBoardroom';

const useBoardroomVersion = () => {
  const [boardroomVersion, setBoardroomVersion] = useState('latest');
  const helioFinance = useHelioFinance();
  const stakedBalance = useStakedBalanceOnBoardroom();

  const updateState = useCallback(async () => {
    setBoardroomVersion(await helioFinance.fetchBoardroomVersionOfUser());
  }, [helioFinance?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (helioFinance?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [helioFinance?.isUnlocked, stakedBalance]);

  return boardroomVersion;
};

export default useBoardroomVersion;
