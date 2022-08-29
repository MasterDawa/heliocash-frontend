import {useEffect, useState} from 'react';
import useHelioFinance from '../useHelioFinance';
import useRefresh from '../useRefresh';

const useWithdrawCheck = (version: number) => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const helioFinance = useHelioFinance();
  const {slowRefresh} = useRefresh();
  const isUnlocked = helioFinance?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await helioFinance.canUserUnstakeFromBoardroom(version));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserWithdraw();
    }
  }, [isUnlocked, helioFinance, slowRefresh, version]);

  return canWithdraw;
};

export default useWithdrawCheck;
