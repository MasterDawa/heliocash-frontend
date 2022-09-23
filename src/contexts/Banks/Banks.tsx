import React, {useCallback, useEffect, useState} from 'react';
import Context from './context';
import useRespectFinance from '../../hooks/useRespectFinance';
import {Bank} from '../../respect-finance';
import config, {bankDefinitions} from '../../config';

const Banks: React.FC = ({children}) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const respectFinance = useRespectFinance();
  const isUnlocked = respectFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!respectFinance.isUnlocked) continue;

        // only show pools staked by user
        const balance = await respectFinance.stakedBalanceOnBank(
          bankInfo.contract,
          bankInfo.poolId,
          bankInfo.sectionInUI,
          respectFinance.myAccount,
        );
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: respectFinance.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName === 'RESPECT' ? respectFinance.RESPECT : respectFinance.RSHARE,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [respectFinance, setBanks]);

  useEffect(() => {
    if (respectFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, respectFinance, fetchPools]);

  return <Context.Provider value={{banks}}>{children}</Context.Provider>;
};

export default Banks;