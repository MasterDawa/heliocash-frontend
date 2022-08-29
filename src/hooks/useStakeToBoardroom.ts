import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBoardroom = (version: number) => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(helioFinance.stakeShareToBoardroom(version, amount), `Stake ${amount} HSHARE to the boardroom`);
    },
    [helioFinance, handleTransactionReceipt, version],
  );
  return {onStake: handleStake};
};

export default useStakeToBoardroom;
