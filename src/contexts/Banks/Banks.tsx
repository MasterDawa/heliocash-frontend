import React, {useCallback, useEffect, useState} from 'react';
import Context from './context';
import useHelioFinance from '../../hooks/useHelioFinance';
import {Bank} from '../../helio-finance';
import config, {bankDefinitions} from '../../config';

const Banks: React.FC = ({children}) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const helioFinance = useHelioFinance();
  const isUnlocked = helioFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!helioFinance.isUnlocked) continue;

        // only show pools staked by user
        const balance = await helioFinance.stakedBalanceOnBank(
          bankInfo.contract,
          bankInfo.poolId,
          bankInfo.sectionInUI,
          helioFinance.myAccount,
        );
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: helioFinance.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName === 'HELIO' ? helioFinance.HELIO : helioFinance.HSHARE,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [helioFinance, setBanks]);

  useEffect(() => {
    if (helioFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, helioFinance, fetchPools]);

  return <Context.Provider value={{banks}}>{children}</Context.Provider>;
};

export default Banks;
