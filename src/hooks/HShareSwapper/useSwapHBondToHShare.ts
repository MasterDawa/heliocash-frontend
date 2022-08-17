import {useCallback} from 'react';
import useHelioFinance from '../useHelioFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import {parseUnits} from 'ethers/lib/utils';

const useSwapHBondToHShare = () => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapHShare = useCallback(
    (bbondAmount: string) => {
      const bbondAmountBn = parseUnits(bbondAmount, 18);
      handleTransactionReceipt(helioFinance.swapHBondToHShare(bbondAmountBn), `Swap ${bbondAmount} HBond to HShare`);
    },
    [helioFinance, handleTransactionReceipt],
  );
  return {onSwapHShare: handleSwapHShare};
};

export default useSwapHBondToHShare;
