import {useCallback} from 'react';
import useRespectFinance from './useRespectFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBoardroom = () => {
  const respectFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(respectFinance.stakeShareToBoardroom(amount), `Stake ${amount} RSHARE to the boardroom`);
    },
    [respectFinance, handleTransactionReceipt],
  );
  return {onStake: handleStake};
};

export default useStakeToBoardroom;
