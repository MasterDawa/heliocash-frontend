import {useCallback} from 'react';
import userespectFinance from './useRespectFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnBoardroom = ( description?: string) => {
  const respectFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem RSHARE from Boardroom';
    handleTransactionReceipt(respectFinance.exitFromBoardroom(), alertDesc);
  }, [respectFinance, description, handleTransactionReceipt]);
  return {onRedeem: handleRedeem};
};

export default useRedeemOnBoardroom;
