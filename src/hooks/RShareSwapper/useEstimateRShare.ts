import {useCallback, useEffect, useState} from 'react';
import useRespectFinance from '../useRespectFinance';
import {useWallet} from 'use-wallet';
import {BigNumber} from 'ethers';
import {parseUnits} from 'ethers/lib/utils';

const useEstimateRShare = (bbondAmount: string) => {
  const [estimateAmount, setEstimateAmount] = useState<string>('');
  const {account} = useWallet();
  const respectFinance = useRespectFinance();

  const estimateAmountOfRShare = useCallback(async () => {
    const bbondAmountBn = parseUnits(bbondAmount);
    const amount = await respectFinance.estimateAmountOfRShare(bbondAmountBn.toString());
    setEstimateAmount(amount);
  }, [account]);

  useEffect(() => {
    if (account) {
      estimateAmountOfRShare().catch((err) => console.error(`Failed to get estimateAmountOfHShare: ${err.stack}`));
    }
  }, [account, estimateAmountOfRShare]);

  return estimateAmount;
};

export default useEstimateRShare;
