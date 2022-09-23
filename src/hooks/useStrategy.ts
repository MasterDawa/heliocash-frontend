import { BigNumber } from 'ethers';
import { RSHARE_TICKER } from './../utils/constants';
import { useCallback } from 'react';
import useRespectFinance from './useRespectFinance';

const useStrategy = () => {
  const respectFinance = useRespectFinance();
  const ZERO = BigNumber.from('0');

  const handleStrategy = useCallback(async (percentRespectLP: number = 80, stakeBoardroom: number = 20) => {
    if (!respectFinance.myAccount) return;
    const harvestTxs = [];

    if ((await respectFinance.canUserClaimRewardFromBoardroom()) && (await respectFinance.getEarningsOnBoardroom()).gt(ZERO))
      harvestTxs.push(await respectFinance.harvestCashFromBoardroom());
    if ((await respectFinance.earnedFromBank('RShareMaticRShareRewardPool', RSHARE_TICKER, 0, respectFinance.myAccount)).gt(ZERO))
      harvestTxs.push(await respectFinance.harvest('RShareMaticRShareRewardPool', 0, 2));
    if ((await respectFinance.earnedFromBank('RespectEthRShareRewardPool', RSHARE_TICKER, 1, respectFinance.myAccount)).gt(ZERO))
      harvestTxs.push(await respectFinance.harvest('RespectEthRShareRewardPool', 1, 2));

    await Promise.all(harvestTxs.map((tx) => tx.wait()));
    let shareBoardroomAmount = ZERO;
    const zapsCompleted: boolean[] = [];

    for (let retries = 0; retries < 3; retries++) {

      const [respectBalance, shareBalance] = await Promise.all([
        respectFinance.RESPECT.balanceOf(respectFinance.myAccount),
        respectFinance.RSHARE.balanceOf(respectFinance.myAccount)
      ]);
      const shareCompoundAmount = stakeBoardroom > 0 ? shareBalance.mul(100 - stakeBoardroom).div(100) : shareBalance;
      shareBoardroomAmount = stakeBoardroom > 0 && !zapsCompleted[1] ? shareBalance.sub(shareCompoundAmount) : ZERO;

      const zapTxs = [];
      let txIndex = 0;

      if (respectBalance.gt(BigNumber.from('2000000000000000000')) && !zapsCompleted[0])
        zapTxs.push(await respectFinance.zapStrategy(respectFinance.RESPECT.address, respectBalance, percentRespectLP, BigNumber.from('1500000').mul(retries + 1)));
      if (shareCompoundAmount.gt(BigNumber.from('500000000000000')) && !zapsCompleted[1])
        zapTxs.push(await respectFinance.zapStrategy(respectFinance.RSHARE.address, shareCompoundAmount, percentRespectLP, BigNumber.from('1500000').mul(retries + 1)));

      try {
        for (; txIndex < zapTxs.length; txIndex++) {
          zapsCompleted[txIndex] = false;
          const receipt = await zapTxs[txIndex].wait();
          zapsCompleted[txIndex] = receipt.status > 0;
        }
        break;
      } catch (e) { 
        console.error(e);
        zapsCompleted[txIndex] = false;
      }
    }

    const [balanceRESPECTLP, balanceSHARELP] = await Promise.all([
      respectFinance.externalTokens['RESPECT-ETH-LP'].balanceOf(respectFinance.myAccount),
      respectFinance.externalTokens['RSHARE-MATIC-LP'].balanceOf(respectFinance.myAccount)
    ]);

    const stakeTxs = [];

    if (balanceRESPECTLP.gt(ZERO))
      stakeTxs.push(await respectFinance.stake('RespectEthRShareRewardPool', 1, 2, balanceRESPECTLP));
    if (balanceSHARELP.gt(ZERO))
      stakeTxs.push(await respectFinance.stake('RShareMaticRShareRewardPool', 0, 2, balanceSHARELP));
    if (stakeBoardroom > 0 && shareBoardroomAmount.gt(ZERO))
      stakeTxs.push(await respectFinance.currentBoardroom().stake(shareBoardroomAmount));

    await Promise.all(stakeTxs.map((tx) => tx.wait()));

  }, [respectFinance, ZERO]);
  return { onStrategy: handleStrategy };
};

export default useStrategy;
