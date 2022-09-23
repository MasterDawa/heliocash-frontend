import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useRespectFinance from './useRespectFinance';
import useApprove from './useApprove';
import { addTransaction } from '../state/transactions/actions';
import useBank from './useBank';

const APPROVE_AMOUNT = ethers.constants.MaxUint256;
const APPROVE_BASE_AMOUNT = BigNumber.from('1000000000000000000000000');

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApproveStrategy(): [ApprovalState, () => Promise<void>] {
  const respectFinance = useRespectFinance();
  const { RShareRewardPool, Strategy, Boardroom } = respectFinance.contracts;
  const bankRespectLP = useBank('RespectEthRShareRewardPool');
  const bankRshareLP = useBank('RShareMaticRShareRewardPool');
  const [approveStatusStrategy, approveStrategy] = useApprove(respectFinance.RESPECT, Strategy.address);
  const [approveStatusStrategy2, approveStrategy2] = useApprove(respectFinance.RSHARE, Strategy.address);
  const [approveStatusBoardroom, approveBoardroom] = useApprove(respectFinance.RSHARE, Boardroom.address);
  const [approveStatusRespectPair, approveRespectPair] = useApprove(bankRespectLP.depositToken, RShareRewardPool.address);
  const [approveStatusRsharePair, approveRsharePair] = useApprove(bankRshareLP.depositToken, RShareRewardPool.address);

  const approvalState: ApprovalState = useMemo(() => {
    return approveStatusStrategy === ApprovalState.APPROVED && approveStatusStrategy2 === ApprovalState.APPROVED && approveStatusBoardroom === ApprovalState.APPROVED && approveStatusHelioPair === ApprovalState.APPROVED && approveStatusHsharePair === ApprovalState.APPROVED
     ? ApprovalState.APPROVED
     : ApprovalState.NOT_APPROVED;
  }, [approveStatusStrategy, approveStatusStrategy2, approveStatusBoardroom, approveStatusRespectPair, approveStatusRsharePair]);

  const approve = useCallback(async (): Promise<void> => {
    if (
      approveStatusStrategy !== ApprovalState.NOT_APPROVED &&
      approveStatusStrategy2 !== ApprovalState.NOT_APPROVED &&
      approveStatusBoardroom !== ApprovalState.NOT_APPROVED &&
      approveStatusRespectPair !== ApprovalState.NOT_APPROVED &&
      approveStatusRsharePair !== ApprovalState.NOT_APPROVED
    ) {
      console.error('approve was called unnecessarily');
      return;
    }

    if (approveStatusStrategy !== ApprovalState.APPROVED)
      await approveStrategy();
    if (approveStatusStrategy2 !== ApprovalState.APPROVED)
      await approveStrategy2();
    if (approveStatusBoardroom !== ApprovalState.APPROVED)
      await approveBoardroom();
    if (approveStatusRespectPair !== ApprovalState.APPROVED)
      await approveRespectPair();
    if (approveStatusRsharePair !== ApprovalState.APPROVED)
      await approveRsharePair();
  }, [approveStatusStrategy, approveStatusStrategy2, approveStatusBoardroom, approveStatusRespectPair, approveStatusRsharePair]);

  return [approvalState, approve];
}

export default useApproveStrategy;
