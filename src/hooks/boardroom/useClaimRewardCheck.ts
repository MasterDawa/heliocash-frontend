import {useEffect, useState} from 'react';
import useRefresh from '../useRefresh';
import useHelioFinance from '../useHelioFinance';

const useClaimRewardCheck = (version: number) => {
  const {slowRefresh} = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const helioFinance = useHelioFinance();
  const isUnlocked = helioFinance?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await helioFinance.canUserClaimRewardFromBoardroom(version));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, helioFinance, version]);

  return canClaimReward;
};

export default useClaimRewardCheck;
