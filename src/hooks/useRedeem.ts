import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import {Bank} from '../helio-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    handleTransactionReceipt(helioFinance.exit(bank.contract, bank.poolId), `Redeem ${bank.contract}`);
  }, [bank, helioFinance, handleTransactionReceipt]);

  return {onRedeem: handleRedeem};
};

export default useRedeem;
