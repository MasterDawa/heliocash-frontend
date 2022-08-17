import {useCallback} from 'react';
import useHelioFinance from './useHelioFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {parseUnits} from 'ethers/lib/utils';
import {TAX_OFFICE_ADDR} from '../utils/constants';

const useProvideHelioEthLP = () => {
  const helioFinance = useHelioFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideHelioEthLP = useCallback(
    (ftmAmount: string, helioAmount: string) => {
      const helioAmountBn = parseUnits(helioAmount);
      const ftmAmountBn = parseUnits(ftmAmount);
      handleTransactionReceipt(
        helioFinance.provideHelioEthLP(ftmAmountBn, helioAmountBn),
        `Provide HELIO-ETH LP ${helioAmount} ${ftmAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [helioFinance, handleTransactionReceipt],
  );
  return {onProvideHelioEthLP: handleProvideHelioEthLP};
};

export default useProvideHelioEthLP;
