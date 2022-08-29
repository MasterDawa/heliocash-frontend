import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnBoardroom = (version: number, description?: string) => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem HSHARE from Boardroom';
    handleTransactionReceipt(helioFinance.exitFromBoardroom(version), alertDesc);
  }, [helioFinance, description, handleTransactionReceipt, version]);
  return {onRedeem: handleRedeem};
};

export default useRedeemOnBoardroom;
