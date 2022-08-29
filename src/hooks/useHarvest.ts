import { useCallback } from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Bank } from '../helio-finance';

const useHarvest = (bank: Bank) => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {

    handleTransactionReceipt(
      helioFinance.harvest(bank.contract, bank.poolId, bank.sectionInUI),
      `Claim ${bank.earnTokenName} from ${bank.contract}`,
    );

  }, [bank, helioFinance, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvest;
