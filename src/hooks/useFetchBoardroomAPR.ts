import {useEffect, useState} from 'react';
import useHelioFinance from './useHelioFinance';
import useRefresh from './useRefresh';

const useFetchBoardroomAPR = (version: number) => {
  const [apr, setApr] = useState<number>(0);
  const helioFinance = useHelioFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchBoardroomAPR() {
      try {
        setApr(await helioFinance.getBoardroomAPR(version));
      } catch (err) {
        console.error(err);
      }
    }
    fetchBoardroomAPR();
  }, [setApr, helioFinance, slowRefresh, version]);

  return apr;
};

export default useFetchBoardroomAPR;
