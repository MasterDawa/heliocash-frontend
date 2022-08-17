import React, {useMemo, useState} from 'react';
import Page from '../../components/Page';
import {createGlobalStyle} from 'styled-components';
import HomeImage from '../../assets/img/background.jpg';
import useLpStats from '../../hooks/useLpStats';
import {Box, Button, Grid, Paper, Typography} from '@material-ui/core';
import useHelioStats from '../../hooks/useHelioStats';
import TokenInput from '../../components/TokenInput';
import useHelioFinance from '../../hooks/useHelioFinance';
import {useWallet} from 'use-wallet';
import useTokenBalance from '../../hooks/useTokenBalance';
import {getDisplayBalance} from '../../utils/formatBalance';
import useApproveTaxOffice from '../../hooks/useApproveTaxOffice';
import {ApprovalState} from '../../hooks/useApprove';
import useProvideHelioEthLP from '../../hooks/useProvideHelioFtmLP';
import {Alert} from '@material-ui/lab';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
    background-color: #08090d;
  }
`;
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const ProvideLiquidity = () => {
  const [helioAmount, setHelioAmount] = useState(0);
  const [ftmAmount, setFtmAmount] = useState(0);
  const [lpTokensAmount, setLpTokensAmount] = useState(0);
  const {balance} = useWallet();
  // const helioStats = useHelioStats();
  const helioFinance = useHelioFinance();
  const [approveTaxOfficeStatus0, approveTaxOfficeStatus1, approveTaxOffice] = useApproveTaxOffice();
  const helioBalance = useTokenBalance(helioFinance.HELIO);
  const ethBalance = useTokenBalance(helioFinance.ETH);

  const {onProvideHelioEthLP} = useProvideHelioEthLP();
  const helioFtmLpStats = useLpStats('HELIO-ETH-LP');

  const helioLPStats = useMemo(() => (helioFtmLpStats ? helioFtmLpStats : null), [helioFtmLpStats]);
  // const helioPriceInETH = useMemo(() => (helioFtmLpStats ? Number(helioFtmLpStats.priceOfOne).toFixed(2) : null), [helioFtmLpStats]);
  // const ethPriceInHELIO = useMemo(() => (helioFtmLpStats ? Number(helioFtmLpStats.ftmAmount).toFixed(2) : null), [helioFtmLpStats]);
  // const classes = useStyles();

  const handleHelioChange = async (e) => {
    if (!helioLPStats) return;
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setHelioAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setHelioAmount(e.currentTarget.value);
    const quoteFromQuick = await helioFinance.quoteFromQuick(e.currentTarget.value, 'HELIO');
    setFtmAmount(quoteFromQuick);
    setLpTokensAmount(quoteFromQuick / helioLPStats.ftmAmount);
  };

  const handleFtmChange = async (e) => {
    if (!helioLPStats) return;
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setFtmAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setFtmAmount(e.currentTarget.value);
    const quoteFromQuick = await helioFinance.quoteFromQuick(e.currentTarget.value, 'ETH');
    setHelioAmount(quoteFromQuick);

    setLpTokensAmount(quoteFromQuick / helioLPStats.tokenAmount);
  };
  const handleHelioSelectMax = async () => {
    if (!helioLPStats) return;
    const quoteFromQuick = await helioFinance.quoteFromQuick(getDisplayBalance(helioBalance), 'HELIO');
    setHelioAmount(getDisplayBalance(helioBalance));
    setFtmAmount(quoteFromQuick);
    setLpTokensAmount(quoteFromQuick / helioLPStats.ftmAmount);
  };
  const handleFtmSelectMax = async () => {
    if (!helioLPStats) return;
    const quoteFromQuick = await helioFinance.quoteFromQuick(getDisplayBalance(ethBalance), 'ETH');
    setFtmAmount(getDisplayBalance(ethBalance));
    setHelioAmount(quoteFromQuick);
    setLpTokensAmount(quoteFromQuick / helioLPStats.tokenAmount);
  };
  return (
    <Page>
      <BackgroundImage />
      <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
        Provide Liquidity
      </Typography>

      <Grid container justify="center">
        <Box style={{width: '600px'}}>
          {/* <Alert variant="filled" severity="warning" style={{marginBottom: '10px'}}>
            <b>
              This and{' '}
              <a href="https://quickswap.exchange/#/" rel="noopener noreferrer" target="_blank">
                Quickswap
              </a>{' '}
              are the only ways to provide Liquidity on HELIO-ETH pair without paying tax.
            </b>
          </Alert> */}
          <Grid item xs={12} sm={12}>
            <Paper>
              <Box mt={4}>
                <Grid item xs={12} sm={12} style={{borderRadius: 15}}>
                  <Box p={4}>
                    <Grid container>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleHelioSelectMax}
                          onChange={handleHelioChange}
                          value={helioAmount}
                          max={getDisplayBalance(helioBalance)}
                          symbol={'HELIO'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleFtmSelectMax}
                          onChange={handleFtmChange}
                          value={ftmAmount}
                          max={getDisplayBalance(ethBalance)}
                          symbol={'ETH'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        {/* <p>1 HELIO = {helioPriceInETH} ETH</p> */}
                        {/* <p>1 ETH = {ethPriceInHELIO} HELIO</p> */}
                        <p>LP tokens ≈ {lpTokensAmount.toFixed(2)}</p>
                      </Grid>
                      <Grid xs={12} justifyContent="center" style={{textAlign: 'center'}}>
                        {approveTaxOfficeStatus0 === ApprovalState.APPROVED && approveTaxOfficeStatus1 === ApprovalState.APPROVED ? (
                          <Button
                            variant="contained"
                            onClick={() => onProvideHelioEthLP(ftmAmount.toString(), helioAmount.toString())}
                            color="primary"
                            style={{margin: '0 10px', color: '#fff'}}
                          >
                            Supply
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => approveTaxOffice()}
                            color="secondary"
                            style={{margin: '0 10px'}}
                          >
                            Approve
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </Page>
  );
};

export default ProvideLiquidity;
