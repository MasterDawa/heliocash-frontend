import {useCallback} from 'react';
import useRespectFinance from './useRespectFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromBoardroom = () => {
  const respectFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(respectFinance.harvestCashFromBoardroom(), 'Claim RESPECT from Boardroom');
  }, [respectFinance, handleTransactionReceipt]);

  return {onReward: handleReward};
};

export default useHarvestFromBoardroom;
