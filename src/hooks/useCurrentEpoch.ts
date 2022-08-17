import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import {BigNumber} from 'ethers';
import useRefresh from './useRefresh';

const useCurrentEpoch = (version: number) => {
  const [currentEpoch, setCurrentEpoch] = useState<BigNumber>(BigNumber.from(0));
  const helioFinance = useHelioFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await helioFinance.getCurrentEpoch(version));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, helioFinance, slowRefresh, version]);

  return currentEpoch;
};

export default useCurrentEpoch;
