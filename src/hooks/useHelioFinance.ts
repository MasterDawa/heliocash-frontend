import {useContext} from 'react';
import {Context} from '../contexts/BombFinanceProvider';

const useHelioFinance = () => {
  const {helioFinance} = useContext(Context);
  return helioFinance;
};

export default useHelioFinance;
