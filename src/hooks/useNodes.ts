import { BigNumber } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import useRespectFinance from './useRespectFinance';
import config from '../config';

const useNodes = (contract: string, sectionInUI: number, user: string) => {
  const respectFinance = useRespectFinance();

  const [poolAPRs, setPoolAPRs] = useState<BigNumber[]>([]);

  const fetchNodes = useCallback(async () => {
    setPoolAPRs(await respectFinance.getNodes(contract, user));
  }, [respectFinance, contract, user]);

  useEffect(() => {
    if (user && sectionInUI === 3) {
      fetchNodes().catch((err) => console.error(`Failed to fetch APR info: ${err.stack}`));
      const refreshInterval = setInterval(fetchNodes, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [setPoolAPRs, respectFinance, fetchNodes, user, sectionInUI]);

  return poolAPRs;
};

export default useNodes;
