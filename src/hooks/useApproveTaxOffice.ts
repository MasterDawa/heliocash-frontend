import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import ERC20 from '../respect-finance/ERC20';
import { TAX_OFFICE_ADDR } from '../utils/constants';
import useRespectFinance from './useRespectFinance';

const APPROVE_AMOUNT = ethers.constants.MaxUint256;
const APPROVE_BASE_AMOUNT = BigNumber.from('1000000000000000000000000');

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApproveTaxOffice(): [ApprovalState, ApprovalState, () => Promise<void>] {
  const respectFinance = useRespectFinance();
  let token0: ERC20 = respectFinance.RESPECT;
  let token1: ERC20 = respectFinance.ETH;
  // if (zappingToken === MATIC_TICKER) token = respectFinance.MATIC;
  // else if (zappingToken === RESPECT_TICKER) token = respectFinance.RESPECT;
  // else if (zappingToken === RSHARE_TICKER) token = respectFinance.RSHARE;
  const pendingApproval0 = useHasPendingApproval(token0.address, TAX_OFFICE_ADDR);
  const pendingApproval1 = useHasPendingApproval(token1.address, TAX_OFFICE_ADDR);
  const currentAllowance0 = useAllowance(token0, TAX_OFFICE_ADDR, pendingApproval0);
  const currentAllowance1 = useAllowance(token1, TAX_OFFICE_ADDR, pendingApproval1);

  // check the current approval status
  const approvalState0: ApprovalState = useMemo(() => {
    // we might not have enough data to know whether or not we need to approve
    // if (token === respectFinance.MATIC) return ApprovalState.APPROVED;
    if (!currentAllowance0) return ApprovalState.UNKNOWN;

    return currentAllowance0.lt(APPROVE_BASE_AMOUNT)
      ? pendingApproval0
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
    // amountToApprove will be defined if currentAllowance is
  }, [currentAllowance0, pendingApproval0, respectFinance]);

  // check the current approval status
  const approvalState1: ApprovalState = useMemo(() => {
    // we might not have enough data to know whether or not we need to approve
    // if (token === respectFinance.MATIC) return ApprovalState.APPROVED;
    if (!currentAllowance1) return ApprovalState.UNKNOWN;

    return currentAllowance1.lt(APPROVE_BASE_AMOUNT)
      ? pendingApproval1
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
    // amountToApprove will be defined if currentAllowance is
  }, [currentAllowance1, pendingApproval1, respectFinance]);

  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState0 === ApprovalState.APPROVED && approvalState1 === ApprovalState.APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }

    if (approvalState0 !== ApprovalState.APPROVED) {
      const response0 = await token0.approve(TAX_OFFICE_ADDR, APPROVE_AMOUNT);
      addTransaction(response0, {
        summary: `Approve ${token0.symbol}`,
        approval: {
          tokenAddress: token0.address,
          spender: TAX_OFFICE_ADDR,
        },
      });
    }

    if (approvalState1 !== ApprovalState.APPROVED) {
      const response1 = await token1.approve(TAX_OFFICE_ADDR, APPROVE_AMOUNT);
      addTransaction(response1, {
        summary: `Approve ${token1.symbol}`,
        approval: {
          tokenAddress: token1.address,
          spender: TAX_OFFICE_ADDR,
        },
      });
    }
  }, [approvalState0, approvalState1, token0, token1, addTransaction]);

  return [approvalState0, approvalState1, approve];
}

export default useApproveTaxOffice;
