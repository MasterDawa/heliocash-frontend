import {useCallback} from 'react';
import userespectFinance from './useRespectFinance';
import {Bank} from '../respect-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const respectFinance = userespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    handleTransactionReceipt(respectFinance.exit(bank.contract, bank.poolId), `Redeem ${bank.contract}`);
  }, [bank, respectFinance, handleTransactionReceipt]);

  return {onRedeem: handleRedeem};
};

export default useRedeem;
