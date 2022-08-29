import React, { useMemo } from 'react';
import styled from 'styled-components';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';

import Label from '../Label';
import Modal, { ModalProps } from '../Modal';
import ModalTitle from '../ModalTitle';
import useHelioFinance from '../../hooks/useHelioFinance';
import TokenSymbol from '../TokenSymbol';
import { useMediaQuery } from '@material-ui/core';

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const helioFinance = useHelioFinance();

  const helioBalance = useTokenBalance(helioFinance.HELIO);
  const displayHelioBalance = useMemo(() => getDisplayBalance(helioBalance, 18, 2), [helioBalance]);

  const bshareBalance = useTokenBalance(helioFinance.HSHARE);
  const displayHshareBalance = useMemo(() => getDisplayBalance(bshareBalance, 18, 2), [bshareBalance]);

  const bbondBalance = useTokenBalance(helioFinance.HBOND);
  const displayBbondBalance = useMemo(() => getDisplayBalance(bbondBalance, 18, 2), [bbondBalance]);

  const helioLpBalance = useTokenBalance(helioFinance.externalTokens['HELIO-ETH-LP']);
  const displayHelioLpBalance = useMemo(() => getDisplayBalance(helioLpBalance, 18, 2), [helioLpBalance]);

  const hshareLpBalance = useTokenBalance(helioFinance.externalTokens['HSHARE-MATIC-LP']);
  const displayHshareLpBalance = useMemo(() => getDisplayBalance(hshareLpBalance, 18, 2), [hshareLpBalance]);

  const matches = useMediaQuery('(min-width:900px)');

  return (
    <Modal>
      <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <ModalTitle text="Wallet Balance" />

        <Balances style={{ display: 'flex', flexDirection: matches ? 'row' : 'column' }}>
          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="HELIOPNG" />
            <StyledBalance>
              <StyledValue>{displayHelioBalance}</StyledValue>
              <Label text="HELIO" color="#7e48aa" />
            </StyledBalance>
          </StyledBalanceWrapper>

          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="HSHARE" />
            <StyledBalance>
              <StyledValue>{displayHshareBalance}</StyledValue>
              <Label text="HSHARE" color="#7e48aa" />
            </StyledBalance>
          </StyledBalanceWrapper>

          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="HBOND" />
            <StyledBalance>
              <StyledValue>{displayBbondBalance}</StyledValue>
              <Label text="HBOND" color="#7e48aa" />
            </StyledBalance>
          </StyledBalanceWrapper>
        </Balances>

        <Balances style={{ display: 'flex', flexDirection: matches ? 'row' : 'column' }}>
          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="HELIO-ETH-LP" />
            <StyledBalance>
              <StyledValue>{displayHelioLpBalance}</StyledValue>
              <Label text="HELIO-ETH-LP" color="#7e48aa" />
            </StyledBalance>
          </StyledBalanceWrapper>

          <StyledBalanceWrapper style={{ paddingBottom: '15px' }}>
            <TokenSymbol symbol="HSHARE-MATIC-LP" />
            <StyledBalance>
              <StyledValue>{displayHshareLpBalance}</StyledValue>
              <Label text="HSHARE-MATIC-LP" color="#7e48aa" />
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
