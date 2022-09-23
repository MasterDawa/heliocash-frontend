import {useCallback, useEffect, useState} from 'react';
import useRespectFinance from './useRespectfinance';
import config from '../config';
import {BigNumber} from 'ethers';

const useCashPriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const respectFinance = useRespectFinance();

  const fetchCashPrice = useCallback(async () => {
    setPrice(await respectFinance.getRespectPriceInLastTWAP());
  }, [respectFinance]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch RESPECT price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, respectFinance, fetchCashPrice]);

  return price;
};

export default useCashPriceInLastTWAP;
