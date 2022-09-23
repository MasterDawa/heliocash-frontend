import { useCallback } from 'react';
import useRespectFinance from './useRespectFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Bank } from '../respect-finance';

const useHarvest = (bank: Bank) => {
  const respectFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {

    handleTransactionReceipt(
      respectFinance.harvest(bank.contract, bank.poolId, bank.sectionInUI),
      `Claim ${bank.earnTokenName} from ${bank.contract}`,
    );

  }, [bank, respectFinance, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvest;
