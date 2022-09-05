import React from 'react';
import {useWallet} from 'use-wallet';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import Bank from '../Bank';

import {Box, Container, Typography, Grid} from '@material-ui/core';

import {Alert} from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import FarmCard from './FarmCard';
import {createGlobalStyle} from 'styled-components';

import useBanks from '../../hooks/useBanks';

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

const Farm = () => {
  const [banks] = useBanks();
  const {path} = useRouteMatch();
  const {account} = useWallet();
  const hsharesActive = true // Date.now() >= config.hsharesLaunchesAt.getTime();
  const activeBanks = banks.filter((bank) => !bank.finished && (hsharesActive || bank.sectionInUI !== 2));

  return (
    <Switch>
      <Page>
         <Route exact path={path}>
          <BackgroundImage />
          {!!account ? (
            <Container maxWidth="lg">
              {/* <Typography color="textYellow" align="center" variant="h3" gutterBottom>
                Farm
              </Typography> */}

              <Box mt={5}>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 2).length === 0}>
                  <Typography color="textPrimary" align="center" variant="h4" gutterBottom>
                    Earn HSHARE by staking QuickSwap LP
                  </Typography>
                  { <Alert variant="filled" severity="info">
                    <h4>
                      Farms started September 6th 2022 and will continue running for 1 full year.</h4>



                  </Alert> }
                  <Grid container spacing={3} style={{marginTop: '20px'}}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 2)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 1).length === 0}>
                  {/* <Typography color="textPrimary" align="center" variant="h4" gutterBottom style={{marginTop: '20px'}}>
                  Earn HELIO by staking QuickSwap LP
                  </Typography> */}
                  {/* <Alert variant="standard" severity="info" style={{marginTop: '30px'}}>
                    Please remove funds from the inactive farms below.
                  </Alert> */}
                  <Grid container spacing={3} style={{marginTop: '20px', display: 'flex', alignItems: 'center'}}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 1)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 0).length === 0}>
                  <Typography color="textPrimary" align="center" variant="h4" gutterBottom style={{marginTop: '20px'}}>
                  Genesis Pools
                  </Typography>
                  <Alert variant="filled" severity="info">
                  Genesis pools run for the first 24 hours starting on September 5 4:00 PM GMT or Unix Epoch Time 1662393600
                  </Alert>
                  <Grid container spacing={3} style={{marginTop: '20px'}}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 0)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                {/* <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 3).length === 0}>
                  <Typography color="textPrimary" align="center" variant="h4" gutterBottom style={{marginTop: '20px'}}>
                    Generate HELIO with Nodes
                  </Typography>
                  <Grid container spacing={3} style={{marginTop: '20px'}}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 3)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div> */}
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <BackgroundImage />
          <Bank />
        </Route>
        {!!account && !hsharesActive && <div style={{marginTop: '2rem'}}><LaunchCountdown deadline={config.hsharesLaunchesAt} description='HSHARE Farms'/></div>}
      </Page>
    </Switch>
  );
};

export default Farm;
