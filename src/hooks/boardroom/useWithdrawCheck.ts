import {useEffect, useState} from 'react';
import useHelioFinance from '../useHelioFinance';
import useRefresh from '../useRefresh';

const useWithdrawCheck = () => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const helioFinance = useHelioFinance();
  const {slowRefresh} = useRefresh();
  const isUnlocked = helioFinance?.isUnlocked;

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
  }, [isUnlocked, helioFinance, slowRefresh]);

  return canWithdraw;
};

export default useWithdrawCheck;
