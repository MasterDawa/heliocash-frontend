import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromBoardroom = () => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        helioFinance.withdrawShareFromBoardroom(amount),
        `Withdraw ${amount} HSHARE from the boardroom`,
      );
    },
    [helioFinance, handleTransactionReceipt],
  );
  return {onWithdraw: handleWithdraw};
};

export default useWithdrawFromBoardroom;
