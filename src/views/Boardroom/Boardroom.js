import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { makeStyles } from '@material-ui/core/styles';
import config from '../../config';

import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import ProgressCountdown from './components/ProgressCountdown';
import { createGlobalStyle } from 'styled-components';

import HomeImage from '../../assets/img/background.jpg';
import LaunchCountdown from '../../components/LaunchCountdown';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #08090d;
  }
`;

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const Boardroom = () => {
  const classes = useStyles();
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnBoardroom();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const currentEpoch = useCurrentEpoch();
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnBoardroom();
  const boardroomAPR = useFetchBoardroomAPR();
  const canClaimReward = useClaimRewardCheck();
  const canWithdraw = useWithdrawCheck();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();
  const rsharesActive = Date.now() >= config.boardroomLaunchesAt.getTime();

  return (
    <Page>
      <BackgroundImage />
      {!!account ? (
        !rsharesActive ? <LaunchCountdown deadline={config.boardroomLaunchesAt} description='Home' descriptionLink='/' />
          : <>
            <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
              Boardroom
            </Typography>
            <Box mt={5}>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                  <Card className={classes.gridItem}>
                    <CardContent style={{ textAlign: 'center' }}>
                      <Typography style={{ textTransform: 'uppercase', color: '#7e48aa' }}>Next Epoch</Typography>
                      <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                  <Card className={classes.gridItem}>
                    <CardContent align="center">
                      <Typography style={{ textTransform: 'uppercase', color: '#7e48aa' }}>Current Epoch</Typography>
                      <Typography>{Number(currentEpoch)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                  <Card className={classes.gridItem}>
                    <CardContent align="center">
                      <Typography style={{ textTransform: 'uppercase', color: '#7e48aa' }}>
                        RESPECT PEG <small>(TWAP)</small>
                      </Typography>
                      <Typography>{scalingFactor} ETH</Typography>
                      <Typography>
                        <small>per 4,000 RESPECT</small>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                  <Card className={classes.gridItem}>
                    <CardContent align="center">
                      <Typography style={{ textTransform: 'uppercase', color: '#7e48aa' }}>APR</Typography>
                      <Typography>{boardroomAPR.toFixed(2)}%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                  <Card className={classes.gridItem}>
                    <CardContent align="center">
                      <Typography style={{ textTransform: 'uppercase', color: '#7e48aa' }}>HSHARES Staked</Typography>
                      <Typography>{getDisplayBalance(totalStaked)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
          
              <Box mt={4}>
                <StyledBoardroom>
                  <StyledCardsWrapper>
                    <StyledCardWrapper>
                      <Harvest />
                    </StyledCardWrapper>
                    <Spacer />
                    <StyledCardWrapper>
                      <Stake />
                    </StyledCardWrapper>
                  </StyledCardsWrapper>
                </StyledBoardroom>
              </Box>

              {/* <Grid container justify="center" spacing={3}>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Rewards</Typography>

                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button color="primary" variant="outlined">Claim Reward</Button>
                </CardActions>
                <CardContent align="center">
                  <Typography>Claim Countdown</Typography>
                  <Typography>00:00:00</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Stakings</Typography>
                  <Typography>{getDisplayBalance(stakedBalance)}</Typography>
                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button>+</Button>
                  <Button>-</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid> */}
            </Box>

            {/* <Box mt={5}>
              <Grid container justify="center" spacing={3} mt={10}>
                <Button
                  disabled={!canClaimReward || earnings.lt(1e18)}
                  onClick={onCompound}
                  className={
                     !canClaimReward || earnings.lt(1e18)
                      ? 'shinyButtonDisabledSecondary'
                      : 'shinyButtonSecondary'
                  }
                >
                  Compound
                </Button>
              </Grid>
            </Box> */}
            <Box mt={5}>
              <Grid container justify="center" spacing={3} mt={10}>
                <Button
                  disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                  onClick={onRedeem}
                  className={
                    stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)
                      ? 'shinyButtonDisabledSecondary'
                      : 'shinyButtonSecondary'
                  }
                >
                  Claim &amp; Withdraw
                </Button>
              </Grid>
            </Box>
            {/* <Box mt={5}>
              <Grid container justify="center" spacing={3}>
                <Alert variant="outlined" severity="info" style={{ width: "20rem" }}>
                  Please remove funds from <a href="/boardroom">BoardroomV1</a>
                </Alert>
              </Grid>
            </Box> */}
          </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
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

export default Boardroom;