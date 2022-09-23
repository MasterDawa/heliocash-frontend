import React, { useMemo } from 'react';
import styled from 'styled-components';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';

import Label from '../Label';
import Modal, { ModalProps } from '../Modal';
import ModalTitle from '../ModalTitle';
import useRespectFinance from '../../hooks/useRespectFinance';
import TokenSymbol from '../TokenSymbol';
import { useMediaQuery } from '@material-ui/core';

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const respectFinance = useRespectFinance();

  const respectBalance = useTokenBalance(respectFinance.RESPECT);
  const displayRespectBalance = useMemo(() => getDisplayBalance(respectBalance, 18, 2), [respectBalance]);

  const bshareBalance = useTokenBalance(respectFinance.RSHARE);
  const displayRshareBalance = useMemo(() => getDisplayBalance(bshareBalance, 18, 2), [bshareBalance]);

  const bbondBalance = useTokenBalance(respectFinance.RBOND);
  const displayBbondBalance = useMemo(() => getDisplayBalance(bbondBalance, 18, 2), [bbondBalance]);

  const respectLpBalance = useTokenBalance(respectFinance.externalTokens['RESPECT-ETH-LP']);
  const displayRespectLpBalance = useMemo(() => getDisplayBalance(respectLpBalance, 18, 2), [respectLpBalance]);

  const rshareLpBalance = useTokenBalance(respectFinance.externalTokens['RSHARE-MATIC-LP']);
  const displayRshareLpBalance = useMemo(() => getDisplayBalance(rshareLpBalance, 18, 2), [rshareLpBalance]);

  const matches = useMediaQuery('(min-width:900px)');

  return (
    <Modal>
      <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <ModalTitle text="Wallet Balance" />

        <Balances style={{ display: 'flex', flexDirection: matches ? 'row' : 'column' }}>
          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="RESPECTPNG" />
            <StyledBalance>
              <StyledValue>{displayRespectBalance}</StyledValue>
              <Label text="RESPECT" color="#7e48aa" />
            </StyledBalance>
          </StyledBalanceWrapper>

          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="RSHARE" />
            <StyledBalance>
              <StyledValue>{displayRshareBalance}</StyledValue>
              <Label text="RSHARE" color="#7e48aa" />
            </StyledBalance>
          </StyledBalanceWrapper>

          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="RBOND" />
            <StyledBalance>
              <StyledValue>{displayBbondBalance}</StyledValue>
              <Label text="RBOND" color="#7e48aa" />
            </StyledBalance>
          </StyledBalanceWrapper>
        </Balances>

        <Balances style={{ display: 'flex', flexDirection: matches ? 'row' : 'column' }}>
          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="RESPECT-ETH-LP" />
            <StyledBalance>
              <StyledValue>{displayRESPECTLpBalance}</StyledValue>
              <Label text="RESPECT-ETH-LP" color="#7e48aa" />
            </StyledBalance>
          </StyledBalanceWrapper>

          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="RSHARE-MATIC-LP" />
            <StyledBalance>
              <StyledValue>{displayRshareLpBalance}</StyledValue>
              <Label text="RSHARE-MATIC-LP" color="#7e48aa" />
            </StyledBalance>
          </StyledBalanceWrapper>
        </Balances>
      </div>
    </Modal>
  );
};

const StyledValue = styled.div`
  color: white;
  font-size: 30px;
  font-weight: 700;
`;

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Balances = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  // margin-bottom: 1rem;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 24px;
`;

export default AccountModal;
