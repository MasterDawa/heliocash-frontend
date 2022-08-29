import {useCallback, useEffect, useState} from 'react';
import useHelioFinance from '../useHelioFinance';
import {useWallet} from 'use-wallet';
import {BigNumber} from 'ethers';
import {parseUnits} from 'ethers/lib/utils';

const useEstimateHShare = (bbondAmount: string) => {
  const [estimateAmount, setEstimateAmount] = useState<string>('');
  const {account} = useWallet();
  const helioFinance = useHelioFinance();

  const estimateAmountOfHShare = useCallback(async () => {
    const bbondAmountBn = parseUnits(bbondAmount);
    const amount = await helioFinance.estimateAmountOfHShare(bbondAmountBn.toString());
    setEstimateAmount(amount);
  }, [account]);

  useEffect(() => {
    if (account) {
      estimateAmountOfHShare().catch((err) => console.error(`Failed to get estimateAmountOfHShare: ${err.stack}`));
    }
  }, [account, estimateAmountOfHShare]);

  return estimateAmount;
};

export default useEstimateHShare;
