import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromBoardroom = () => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(helioFinance.harvestCashFromBoardroom(), 'Claim HELIO from Boardroom');
  }, [helioFinance, handleTransactionReceipt]);

  return {onReward: handleReward};
};

export default useHarvestFromBoardroom;
