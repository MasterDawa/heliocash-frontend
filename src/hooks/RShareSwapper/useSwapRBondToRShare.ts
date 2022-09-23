import {useCallback} from 'react';
import useRespectFinance from '../useRespectFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import {parseUnits} from 'ethers/lib/utils';

const useSwapHBondToHShare = () => {
  const respectFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapHShare = useCallback(
    (bbondAmount: string) => {
      const bbondAmountBn = parseUnits(bbondAmount, 18);
      handleTransactionReceipt(respectFinance.swapRBondToRShare(bbondAmountBn), `Swap ${bbondAmount} RBond to RShare`);
    },
    [respectFinance, handleTransactionReceipt],
  );
  return {onSwapHShare: handleSwapHShare};
};

export default useSwapRBondToRShare;