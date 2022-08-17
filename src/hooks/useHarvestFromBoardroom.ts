import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromBoardroom = (version: number) => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(helioFinance.harvestCashFromBoardroom(version), 'Claim HELIO from Boardroom');
  }, [helioFinance, handleTransactionReceipt, version]);

  return {onReward: handleReward};
};

export default useHarvestFromBoardroom;
