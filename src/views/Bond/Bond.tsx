import React, {useCallback, useMemo} from 'react';
import Page from '../../components/Page';
import {createGlobalStyle} from 'styled-components';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {useWallet} from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useRespectStats from '../../hooks/useRespectStats';
import useRespectFinance from '../../hooks/useRespectFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import {useTransactionAdder} from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import {getDisplayBalance} from '../../utils/formatBalance';
import {BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN} from '../../respect-finance/constants';

import HomeImage from '../../assets/img/background.jpg';
import LaunchCountdown from '../../components/LaunchCountdown';
import config from '../../config';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #08090d;
  }
`;

const Bond: React.FC = () => {
  const {path} = useRouteMatch();
  const {account} = useWallet();
  const respectFinance = useRespectFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const respectStat = useRespectStats();
  const cashPrice = useCashPriceInLastTWAP();

  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(respectFinance?.RBOND);
  // const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice).toFixed(4) : null), [cashPrice]);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await respectFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} RBOND with ${amount} RESPECT`,
      });
    },
    [respectFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await respectFinance.redeemBonds(amount);
      addTransaction(tx, {summary: `Redeem ${amount} RBOND`});
    },
    [respectFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInETH) < 1.01, [bondStat]);
  const now = Date.now();

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={'🏦'} title="Buy &amp; Redeem Bonds" subtitle="Earn premiums upon respect power" />
            </Route>
            <StyledBond>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Purchase"
                  fromToken={respectFinance.RESPECT}
                  fromTokenName="RESPECT"
                  toToken={respectFinance.RBOND}
                  toTokenName="RBOND"
                  priceDesc={
                    !isBondPurchasable
                      ? 'RESPECT is over peg'
                      : getDisplayBalance(bondsPurchasable, 18, 4) + ' RBOND available for purchase'
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="4,000 RESPECT"
                  description="Last-Hour TWAP Price"
                  price={Number(respectStat?.tokenInETH).toFixed(4) || '-'}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="4,000 RBOND"
                  description="Current Price: (RESPECT)^2"
                  price={Number(bondStat?.tokenInETH).toFixed(4) || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={respectFinance.RBOND}
                  fromTokenName="RBOND"
                  toToken={respectFinance.RESPECT}
                  toTokenName="RESPECT"
                  priceDesc={`${getDisplayBalance(bondBalance)} RBOND Available in wallet`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when 4,000 RESPECT > ${BOND_REDEEM_PRICE}ETH` : null}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Bond;
