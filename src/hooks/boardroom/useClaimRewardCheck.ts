import {useEffect, useState} from 'react';
import useRefresh from '../useRefresh';
import useRespectFinance from '../useRespectFinance';

const useClaimRewardCheck = () => {
  const {slowRefresh} = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const respectFinance = useRespectFinance();
  const isUnlocked = respectFinance?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await respectFinance.canUserClaimRewardFromBoardroom());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, respectFinance]);

  return canClaimReward;
};

export default useClaimRewardCheck;
