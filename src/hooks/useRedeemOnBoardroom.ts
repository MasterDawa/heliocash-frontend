import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnBoardroom = ( description?: string) => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem HSHARE from Boardroom';
    handleTransactionReceipt(helioFinance.exitFromBoardroom(), alertDesc);
  }, [helioFinance, description, handleTransactionReceipt]);
  return {onRedeem: handleRedeem};
};

export default useRedeemOnBoardroom;
