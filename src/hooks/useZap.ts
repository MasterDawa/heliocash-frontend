import { BigNumber } from 'ethers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { useCallback } from 'react';
import useRespectFinance from './useRespectFinance';
import { Bank } from '../respect-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { useDepositLottery } from './useDetonator';

const useZap = (bank: Bank) => {
  const respectFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleZap = useCallback(
    (zappingToken: string, tokenName: string, amount: string, slippageBp: string) => {
      handleTransactionReceipt(
        respectFinance.zapIn(zappingToken, tokenName, amount, slippageBp),
        `Zap ${amount} in ${bank.depositTokenName}.`,
      );
    },
    [bank, respectFinance, handleTransactionReceipt],
  );

  async function handleZapIn(
    zappingToken: string,
    tokenName: string,
    amount: string,
    slippageBp: string,
    startBalance: BigNumber,
    onDeposit: ((amount: string) => void) | ((amount: string) => Promise<any>)
  ) {
    const zapTx = await respectFinance.zapIn(zappingToken, tokenName, amount, slippageBp);
    await zapTx.wait();
    const afterBalance = await respectFinance.externalTokens[tokenName].balanceOf(respectFinance.myAccount);
    return await onDeposit(new BigNumberJS(afterBalance.sub(startBalance).toString()).div(new BigNumberJS(10).pow(18)).toFixed());
  }

  return { onZap: handleZap, onZapIn: handleZapIn };
};

export default useZap;
