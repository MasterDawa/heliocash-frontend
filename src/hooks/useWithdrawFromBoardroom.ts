import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromBoardroom = (version: number) => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        helioFinance.withdrawShareFromBoardroom(version, amount),
        `Withdraw ${amount} HSHARE from the boardroom`,
      );
    },
    [helioFinance, handleTransactionReceipt, version],
  );
  return {onWithdraw: handleWithdraw};
};

export default useWithdrawFromBoardroom;
