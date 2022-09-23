import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Button, Card, CardContent, Typography, Grid, Select, withStyles, MenuItem } from '@material-ui/core';

import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../respect-finance';
import useRespectFinance from '../../hooks/useRespectFinance';
import useNodes from '../../hooks/useNodes';
import { Text } from '../../components/Text';
import useNodeText from '../../hooks/useNodeText';
import { getDisplayBalance } from '../../utils/formatBalance';
import useClaimedBalance from '../../hooks/useClaimedBalance';
import useStakedBalance from '../../hooks/useStakedBalance';
import StartTimer from '../Detonator/components/StartTimer';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const classes = useStyles();
  const { bankId } = useParams();
  const bank = useBank(bankId);
  const [poolId, setPoolId] = useState(0);
  const LOCK_ID = 'LOCK_ID';

  const { account } = useWallet();
  const { getNodeText } = useNodeText();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);
  const nodes = useNodes(bank.contract, bank.sectionInUI, account);
  const hasNodes = nodes.length > 0 && nodes.filter((x) => x.gt(0)).length > 0;
  const claimBalance = useClaimedBalance(bank.contract, bank.sectionInUI, account);
  const maxPayout = useStakedBalance(bank.contract, bank.poolId, bank.sectionInUI, account).mul(4);
  const [width, setWidth] = useState(window.innerWidth);
  
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768
  const nodeStartTime = 0;
  const isNodeStart = bank.sectionInUI !== 3 || Date.now() / 1000 >= nodeStartTime;
  
  const handleChangeNode = (event: any) => {
    const value = event.target.value;
    setPoolId(Number(value));
    bank.poolId = Number(value);
    localStorage.setItem(LOCK_ID, String(value))
  }

  useEffect(() => {
    if (bank.sectionInUI !== 3) return;
    const poolId = localStorage.getItem(LOCK_ID)
    
    if (poolId) {
      setPoolId(Number(poolId));
      bank.poolId = Number(poolId);
    } else {
      setPoolId(bank.poolId);
    }
  });

  return account && bank && isNodeStart ? (
    <>
      <PageHeader
        icon="🏦"
        subtitle={bank.sectionInUI !== 3
          ? `Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`
          : `Purchase nodes to generate HELIO`
        }
        title={bank?.name}
      />
      <Box>
        <Grid container justify="center" spacing={3} style={{ marginBottom: '50px' }}>
          {bank.sectionInUI === 3 &&
            <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
              <StyledOutlineWrapper>
                <StyledOutline />
                <Card className={classes.gridItem}>
                  <CardContent style={{ textAlign: 'center' }}>
                    <Typography>Node Type</Typography>
                    <Select variant='outlined' onChange={handleChangeNode} style={{ height: '2.5rem', color: '#7e48aa', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginLeft: '1rem', marginBottom: '-16px' }} labelId="label" id="select" value={poolId}>
                      <StyledMenuItem value={0}>{getNodeText(0)}</StyledMenuItem>
                      <StyledMenuItem value={1}>{getNodeText(1)}</StyledMenuItem>
                      <StyledMenuItem value={2}>{getNodeText(2)}</StyledMenuItem>
                      <StyledMenuItem value={3}>{getNodeText(3)}</StyledMenuItem>
                      <StyledMenuItem value={4}>{getNodeText(4)}</StyledMenuItem>
                    </Select>
                  </CardContent>
                </Card>
              </StyledOutlineWrapper>
            </Grid>
          }
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>APR</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>Daily APR</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>TVL</Typography>
                <Typography>${statsOnPool?.TVL}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      {bank.sectionInUI === 3 && hasNodes && <Box>
        <Grid container justify="center" spacing={3} style={{ marginBottom: '50px' }}>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>Est Yearly RESPECT</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.userYearlyBurst}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>Est Daily RESPECT</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.userDailyBurst}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>}
      <Box mt={5}>
        <StyledBank>
          <StyledCardsWrapper>
            <StyledCardWrapper>
              <Harvest bank={bank} />
            </StyledCardWrapper>
            <Spacer />
            <StyledCardWrapper>{<Stake bank={bank} />}</StyledCardWrapper>
          </StyledCardsWrapper>
          {bank.sectionInUI !== 3 && <Spacer size="lg" />}
          {bank.depositTokenName.includes('LP') && <LPTokenHelpText bank={bank} />}
          <Spacer size="lg" />
          {bank.sectionInUI !== 3 ?
            <div>
              <Button onClick={onRedeem} className="shinyButtonSecondary">
                Claim &amp; Withdraw
              </Button>
            </div>
            :
            hasNodes ?
              <div style={{ display: 'flex',  flexDirection: isMobile ? 'column' : 'row' }}>
                <Card style={{ backgroundColor: '#08090d' }}>
                  <CardContent>
                    <StyledTitle>Nodes</StyledTitle>
                    {nodes.map((num, id) => {
                      return num.gt(0)
                        ?
                        <Text style={{ display: 'flex', fontSize: '1rem', marginTop: '8px' }} key={id}>
                          <b style={{ color: 'rgb(29, 72, 182)', marginRight: '8px' }}>
                            {num.toString()}x
                          </b>
                          <div>
                            {getNodeText(id)}{num.gt(1) ? 's' : ''}
                          </div>
                        </Text>
                        : null;
                    })}
                  </CardContent>
                </Card>
                <Card style={{ marginLeft: isMobile ? '0' : '1.5rem', marginTop: isMobile ? '1.5rem' : '0'}}>
                  <CardContent>
                    <StyledTitle>Claimed</StyledTitle>
                    <Text style={{ fontSize: '1rem', marginTop: '8px' }}>
                      {getDisplayBalance(claimBalance, 18, 2)} HELIO
                    </Text>
                  </CardContent>
                </Card>
                <Card style={{ marginLeft: isMobile ? '0' : '1.5rem', marginTop: isMobile ? '1.5rem' : '0'}}>
                  <CardContent>
                    <StyledTitle>Max Payout</StyledTitle>
                    <Text style={{ fontSize: '1rem', marginTop: '8px' }}>
                      {getDisplayBalance(maxPayout, 18, 0)} HELIO
                    </Text>
                  </CardContent>
                </Card>
              </div>
              : null
          }
          <Spacer size="lg" />
        </StyledBank>
      </Box>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : !isNodeStart ? (
    <StartTimer startTime={nodeStartTime} />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  const respectFinance = useRespectFinance();
  const respectAddr = respectFinance.RESPECT.address;
  const bshareAddr = respectFinance.RSHARE.address;

  let pairName: string;
  let uniswapUrl: string;
  if (bank.depositTokenName === 'RESPECT-ETH-LP') {
    pairName = 'RESPECT-ETH pair';
    uniswapUrl = 'https://quickswap.exchange/#/add/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/' + respectAddr;
  } else if (bank.depositTokenName === 'RESPECT-RSHARE-LP') {
    pairName = 'RESPECT-RSHARE pair';
    uniswapUrl = 'https://quickswap.exchange/#/add/' + bshareAddr + '/' + respectAddr;
  } else {
    pairName = 'RSHARE-MATIC pair';
    uniswapUrl = 'https://quickswap.exchange/#/add/ETH' + bshareAddr;
  }
  return (
    <Card>
      <CardContent>
        <StyledLink href={uniswapUrl} target="_blank">
          {`Provide liquidity for ${pairName} now on QuickSwap`}
        </StyledLink>
      </CardContent>
    </Card>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="🏚" title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
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

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled.h1`
  color: '#7e48aa';
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`;

const StyledOutline = styled.div`
  background: #7e48aa;
  background-size: 300% 300%;
  border-radius: 0px;
  filter: blur(8px);
  position: absolute;
  top: -6px;
  right: -6px;
  bottom: -6px;
  left: -6px;
  z-index: -1;
`;

const StyledOutlineWrapper = styled.div`    
    position: relative;
    background: #08090d;
    border-radius: 0px;
    box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)
`;

const StyledMenuItem = withStyles({
  root: {
    backgroundColor: '#08090d',
    color: '#dddfee',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: 'black',
      color: '#7e48aa',
    },
    selected: {
      backgroundColor: 'white',
    },
  },
})(MenuItem);

export default Bank;
