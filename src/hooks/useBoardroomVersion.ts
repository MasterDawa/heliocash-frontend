import {useCallback, useEffect, useState} from 'react';
import useRespectFinance' from './useRespectFinance';
import useStakedBalanceOnBoardroom from './useStakedBalanceOnBoardroom';

const useBoardroomVersion = () => {
  const [boardroomVersion, setBoardroomVersion] = useState('latest');
  const respectFinance = useRespectFinance();
  const stakedBalance = useStakedBalanceOnBoardroom();

  const updateState = useCallback(async () => {
    setBoardroomVersion(await respectFinance.fetchBoardroomVersionOfUser());
  }, [respectFinance?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (respectFinance?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [respectFinance?.isUnlocked, stakedBalance]);

  return boardroomVersion;
};

export default useBoardroomVersion;
