import {useCallback, useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import config from '../config';
import {BigNumber} from 'ethers';

const useCashPriceInLastTWAP = (version: number) => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const helioFinance = useHelioFinance();

  const fetchCashPrice = useCallback(async () => {
    setPrice(await helioFinance.getHelioPriceInLastTWAP(version));
  }, [helioFinance, version]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch HELIO price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, helioFinance, fetchCashPrice, version]);

  return price;
};

export default useCashPriceInLastTWAP;
