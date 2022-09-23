import {useContext} from 'react';
import {Context} from '../contexts/RespectFinanceProvider';

const useRespectFinance = () => {
  const {respectFinance} = useContext(Context);
  return respectFinance;
};

export default useRespectFinance;
