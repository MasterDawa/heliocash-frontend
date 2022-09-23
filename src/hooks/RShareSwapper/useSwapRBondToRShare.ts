import {useCallback} from 'react';
import useRespectFinance from '../useRespectFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import {parseUnits} from 'ethers/lib/utils';

const useSwapRBondToRShare = () => {
  const helioFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapR = useCallback(
    (bbondAmount: string) => {
      const bbondAmountBn = parseUnits(bbondAmount, 18);
      handleTransactionReceipt(respectFinance.swapR
      ToR(bbondAmountBn), `Swap ${bbondAmount} R
     to R`);
    },
    [respectFinance, handleTransactionReceipt],
  );
  return {onSwapR: handleSwapR};
};

export default useSwapRToR;
