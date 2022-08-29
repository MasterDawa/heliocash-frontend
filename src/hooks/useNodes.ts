import { BigNumber } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import useHelioFinance from './useHelioFinance';
import config from '../config';

const useNodes = (contract: string, sectionInUI: number, user: string) => {
  const helioFinance = useHelioFinance();

  const [poolAPRs, setPoolAPRs] = useState<BigNumber[]>([]);

  const fetchNodes = useCallback(async () => {
    setPoolAPRs(await helioFinance.getNodes(contract, user));
  }, [helioFinance, contract, user]);

  useEffect(() => {
    if (user && sectionInUI === 3) {
      fetchNodes().catch((err) => console.error(`Failed to fetch APR info: ${err.stack}`));
      const refreshInterval = setInterval(fetchNodes, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [setPoolAPRs, helioFinance, fetchNodes, user, sectionInUI]);

  return poolAPRs;
};

export default useNodes;
