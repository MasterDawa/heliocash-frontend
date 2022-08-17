import { BigNumber } from 'ethers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { useCallback } from 'react';
import useHelioFinance from './useHelioFinance';
import { Bank } from '../helio-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { useDepositLottery } from './useDetonator';

const useZap = (bank: Bank) => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleZap = useCallback(
    (zappingToken: string, tokenName: string, amount: string, slippageBp: string) => {
      handleTransactionReceipt(
        helioFinance.zapIn(zappingToken, tokenName, amount, slippageBp),
        `Zap ${amount} in ${bank.depositTokenName}.`,
      );
    },
    [bank, helioFinance, handleTransactionReceipt],
  );

  async function handleZapIn(
    zappingToken: string,
    tokenName: string,
    amount: string,
    slippageBp: string,
    startBalance: BigNumber,
    onDeposit: ((amount: string) => void) | ((amount: string) => Promise<any>)
  ) {
    const zapTx = await helioFinance.zapIn(zappingToken, tokenName, amount, slippageBp);
    await zapTx.wait();
    const afterBalance = await helioFinance.externalTokens[tokenName].balanceOf(helioFinance.myAccount);
    return await onDeposit(new BigNumberJS(afterBalance.sub(startBalance).toString()).div(new BigNumberJS(10).pow(18)).toFixed());
  }

  return { onZap: handleZap, onZapIn: handleZapIn };
};

export default useZap;
