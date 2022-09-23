import {useCallback} from 'react';
import useRespectFinance from './useRespectFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromBoardroom = () => {
  const respectFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        respectFinance.withdrawShareFromBoardroom(amount),
        `Withdraw ${amount} RSHARE from the boardroom`,
      );
    },
    [respectFinance, handleTransactionReceipt],
  );
  return {onWithdraw: handleWithdraw};
};

export default useWithdrawFromBoardroom;
