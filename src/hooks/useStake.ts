import {useCallback} from 'react';
import useRespectFinance from './useRespectFinance';
import {Bank} from '../respect-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {parseUnits} from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const useStake = (bank: Bank) => {
  const respectFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      const amountBn = bank.sectionInUI !== 3 
        ? parseUnits(amount, bank.depositToken.decimal)
        : BigNumber.from(amount);
      handleTransactionReceipt(
        respectFinance.stake(bank.contract, bank.poolId, bank.sectionInUI, amountBn),
        `Stake ${amount} ${bank.depositTokenName} to ${bank.contract}`,
      );
    },
    [bank, respectFinance, handleTransactionReceipt],
  );
  return {onStake: handleStake};
};

export default useStake;
