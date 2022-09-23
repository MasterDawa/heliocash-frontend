import {useEffect, useState} from 'react';
import useRespectFinance from '../useRespectinance';
import useRefresh from '../useRefresh';

const useWithdrawCheck = () => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const respectFinance = useRespectFinance();
  const {slowRefresh} = useRefresh();
  const isUnlocked = respectFinance?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await respectFinance.canUserUnstakeFromBoardroom());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserWithdraw();
    }
  }, [isUnlocked, respectFinance, slowRefresh]);

  return canWithdraw;
};

export default useWithdrawCheck;
