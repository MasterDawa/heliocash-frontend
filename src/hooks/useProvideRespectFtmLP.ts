import {useCallback} from 'react';
import useRespectFinance from './useRespectFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {parseUnits} from 'ethers/lib/utils';
import {TAX_OFFICE_ADDR} from '../utils/constants';

const useProviderespectEthLP = () => {
  const respectFinance = useRespectFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideRespectEthLP = useCallback(
    (ftmAmount: string, respectAmount: string) => {
      const respectAmountBn = parseUnits(respectAmount);
      const ftmAmountBn = parseUnits(ftmAmount);
      handleTransactionReceipt(
        respectFinance.provideRespectEthLP(ftmAmountBn, respectAmountBn),
        `Provide RESPECT-ETH LP ${respectAmount} ${ftmAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [respectFinance, handleTransactionReceipt],
  );
  return {onProviderespectEthLP: handleProvideRespectEthLP};
};

export default useProviderespectEthLP;
