import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import useRefresh from './useRefresh';

const useFetchBoardroomAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const respectFinance = useRespectFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchBoardroomAPR() {
      try {
        setApr(await respectFinance.getBoardroomAPR());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBoardroomAPR();
  }, [setApr, respectFinance, slowRefresh]);

  return apr;
};

export default useFetchBoardroomAPR;
