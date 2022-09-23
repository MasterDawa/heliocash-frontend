import {useEffect, useState} from 'react';
import useHelioFinance from '../useRespectinance';
import useRefresh from '../useRefresh';

const useWithdrawCheck = () => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const respectFinance = useRespectFinance();
  const {slowRefresh} = useRefresh();
  const isUnlocked = respectFinance?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await helioFinance.canUserUnstakeFromBoardroom());
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
