import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBoardroom = () => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(helioFinance.stakeShareToBoardroom(amount), `Stake ${amount} HSHARE to the boardroom`);
    },
    [helioFinance, handleTransactionReceipt],
  );
  return {onStake: handleStake};
};

export default useStakeToBoardroom;
