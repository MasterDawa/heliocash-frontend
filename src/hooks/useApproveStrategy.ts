import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useHelioFinance from './useHelioFinance';
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
  const helioFinance = useHelioFinance();
  const { HShareRewardPool, Strategy, Boardroom } = helioFinance.contracts;
  const bankHelioLP = useBank('HelioEthHShareRewardPool');
  const bankHshareLP = useBank('HShareMaticHShareRewardPool');
  const [approveStatusStrategy, approveStrategy] = useApprove(helioFinance.HELIO, Strategy.address);
  const [approveStatusStrategy2, approveStrategy2] = useApprove(helioFinance.HSHARE, Strategy.address);
  const [approveStatusBoardroom, approveBoardroom] = useApprove(helioFinance.HSHARE, Boardroom.address);
  const [approveStatusHelioPair, approveHelioPair] = useApprove(bankHelioLP.depositToken, HShareRewardPool.address);
  const [approveStatusHsharePair, approveHsharePair] = useApprove(bankHshareLP.depositToken, HShareRewardPool.address);

  const approvalState: ApprovalState = useMemo(() => {
    return approveStatusStrategy === ApprovalState.APPROVED && approveStatusStrategy2 === ApprovalState.APPROVED && approveStatusBoardroom === ApprovalState.APPROVED && approveStatusHelioPair === ApprovalState.APPROVED && approveStatusHsharePair === ApprovalState.APPROVED
     ? ApprovalState.APPROVED
     : ApprovalState.NOT_APPROVED;
  }, [approveStatusStrategy, approveStatusStrategy2, approveStatusBoardroom, approveStatusHelioPair, approveStatusHsharePair]);

  const approve = useCallback(async (): Promise<void> => {
    if (
      approveStatusStrategy !== ApprovalState.NOT_APPROVED &&
      approveStatusStrategy2 !== ApprovalState.NOT_APPROVED &&
      approveStatusBoardroom !== ApprovalState.NOT_APPROVED &&
      approveStatusHelioPair !== ApprovalState.NOT_APPROVED &&
      approveStatusHsharePair !== ApprovalState.NOT_APPROVED
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
    if (approveStatusHelioPair !== ApprovalState.APPROVED)
      await approveHelioPair();
    if (approveStatusHsharePair !== ApprovalState.APPROVED)
      await approveHsharePair();
  }, [approveStatusStrategy, approveStatusStrategy2, approveStatusBoardroom, approveStatusHelioPair, approveStatusHsharePair]);

  return [approvalState, approve];
}

export default useApproveStrategy;
