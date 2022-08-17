import { BigNumber } from 'ethers';
import { HSHARE_TICKER } from './../utils/constants';
import { useCallback } from 'react';
import useHelioFinance from './useHelioFinance';

const useStrategy = () => {
  const helioFinance = useHelioFinance();
  const ZERO = BigNumber.from('0');

  const handleStrategy = useCallback(async (percentHelioLP: number = 80, stakeBoardroom: number = 20) => {
    if (!helioFinance.myAccount) return;
    const harvestTxs = [];

    if ((await helioFinance.canUserClaimRewardFromBoardroom(1)) && (await helioFinance.getEarningsOnBoardroom(1)).gt(ZERO))
      harvestTxs.push(await helioFinance.harvestCashFromBoardroom(1));
    if ((await helioFinance.earnedFromBank('HShareMaticHShareRewardPool', HSHARE_TICKER, 0, helioFinance.myAccount)).gt(ZERO))
      harvestTxs.push(await helioFinance.harvest('HShareMaticHShareRewardPool', 0, 2));
    if ((await helioFinance.earnedFromBank('HelioEthHShareRewardPool', HSHARE_TICKER, 1, helioFinance.myAccount)).gt(ZERO))
      harvestTxs.push(await helioFinance.harvest('HelioEthHShareRewardPool', 1, 2));

    await Promise.all(harvestTxs.map((tx) => tx.wait()));
    let shareBoardroomAmount = ZERO;
    const zapsCompleted: boolean[] = [];

    for (let retries = 0; retries < 3; retries++) {

      const [helioBalance, shareBalance] = await Promise.all([
        helioFinance.HELIO.balanceOf(helioFinance.myAccount),
        helioFinance.HSHARE.balanceOf(helioFinance.myAccount)
      ]);
      const shareCompoundAmount = stakeBoardroom > 0 ? shareBalance.mul(100 - stakeBoardroom).div(100) : shareBalance;
      shareBoardroomAmount = stakeBoardroom > 0 && !zapsCompleted[1] ? shareBalance.sub(shareCompoundAmount) : ZERO;

      const zapTxs = [];
      let txIndex = 0;

      if (helioBalance.gt(BigNumber.from('2000000000000000000')) && !zapsCompleted[0])
        zapTxs.push(await helioFinance.zapStrategy(helioFinance.HELIO.address, helioBalance, percentHelioLP, BigNumber.from('1500000').mul(retries + 1)));
      if (shareCompoundAmount.gt(BigNumber.from('500000000000000')) && !zapsCompleted[1])
        zapTxs.push(await helioFinance.zapStrategy(helioFinance.HSHARE.address, shareCompoundAmount, percentHelioLP, BigNumber.from('1500000').mul(retries + 1)));

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

    const [balanceHELIOLP, balanceSHARELP] = await Promise.all([
      helioFinance.externalTokens['HELIO-ETH-LP'].balanceOf(helioFinance.myAccount),
      helioFinance.externalTokens['HSHARE-MATIC-LP'].balanceOf(helioFinance.myAccount)
    ]);

    const stakeTxs = [];

    if (balanceHELIOLP.gt(ZERO))
      stakeTxs.push(await helioFinance.stake('HelioEthHShareRewardPool', 1, 2, balanceHELIOLP));
    if (balanceSHARELP.gt(ZERO))
      stakeTxs.push(await helioFinance.stake('HShareMaticHShareRewardPool', 0, 2, balanceSHARELP));
    if (stakeBoardroom > 0 && shareBoardroomAmount.gt(ZERO))
      stakeTxs.push(await helioFinance.currentBoardroom(1).stake(shareBoardroomAmount));

    await Promise.all(stakeTxs.map((tx) => tx.wait()));

  }, [helioFinance, ZERO]);
  return { onStrategy: handleStrategy };
};

export default useStrategy;
