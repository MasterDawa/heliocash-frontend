import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import {Bank} from '../helio-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {parseUnits} from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const useStake = (bank: Bank) => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      const amountBn = bank.sectionInUI !== 3 
        ? parseUnits(amount, bank.depositToken.decimal)
        : BigNumber.from(amount);
      handleTransactionReceipt(
        helioFinance.stake(bank.contract, bank.poolId, bank.sectionInUI, amountBn),
        `Stake ${amount} ${bank.depositTokenName} to ${bank.contract}`,
      );
    },
    [bank, helioFinance, handleTransactionReceipt],
  );
  return {onStake: handleStake};
};

export default useStake;
