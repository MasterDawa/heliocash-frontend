import {useEffect, useState} from 'react';
import useRefresh from '../useRefresh';
import useHelioFinance from '../useHelioFinance';

const useClaimRewardCheck = () => {
  const {slowRefresh} = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const helioFinance = useHelioFinance();
  const isUnlocked = helioFinance?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await helioFinance.canUserClaimRewardFromBoardroom());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, helioFinance]);

  return canClaimReward;
};

export default useClaimRewardCheck;
