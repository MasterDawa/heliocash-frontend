import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import useRefresh from './useRefresh';

const useFetchBoardroomAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const helioFinance = useHelioFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchBoardroomAPR() {
      try {
        setApr(await helioFinance.getBoardroomAPR());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBoardroomAPR();
  }, [setApr, helioFinance, slowRefresh]);

  return apr;
};

export default useFetchBoardroomAPR;
