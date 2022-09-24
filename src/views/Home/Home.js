import React, { useMemo, useState, useEffect } from 'react';
import Page from '../../components/Page';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useHelioStats from '../../hooks/useHelioStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsETH from '../../hooks/useLpStatsETH';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usehShareStats from '../../hooks/usehShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { Helio as helioProd, HShare as hShareProd } from '../../helio-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';

import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useHelioFinance from '../../hooks/useHelioFinance';
import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';

import HelioImage from '../../assets/img/helio_animated.gif';
import RugDocImage from '../../assets/img/rugdoc-badge.png';
import ZrxGuardImage from '../../assets/img/0x-guard.png';

import HomeImage from '../../assets/img/background.jpg';
import AcademyBanner from '../../assets/img/academy-button.png';
import useStrategy from '../../hooks/useStrategy';
import useApproveStrategy, { ApprovalState } from '../../hooks/useApproveStrategy';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #08090d;
  }
`;

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const helioFtmLpStats = useLpStatsETH('HELIO-ETH-LP');
  const hShareFtmLpStats = useLpStats('HSHARE-MATIC-LP');
  const helioStats = useHelioStats();
  const hShareStats = usehShareStats();
  const tBondStats = useBondStats();
  const helioFinance = useHelioFinance();
  const [approvalStateStrategy, approveStrategy] = useApproveStrategy();
  const { onStrategy } = useStrategy()
  const [strategyValue, setStrategyValue] = useState(80);
  const [boardroomValue, setBoardroomValue] = useState(20);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [expanded, setExpanded] = useState(false);

  function onToggleExpansion() {
    setExpanded(!expanded);
  }

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;

  async function executeApprovals() {
    try {
      setLoading(true);
      await approveStrategy();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  async function executeStrategy() {
    try {
      setLoading(true);
      await onStrategy(strategyValue, boardroomValue);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleStrategyChange = (event, newValue) => {
    setStrategyValue(Number(newValue));
  };
  const handleBoardroomChange = (event, newValue) => {
    setBoardroomValue(Number(newValue));
  };

  const helio = helioProd;
  const hShare = hShareProd;

  const buyHelioAddress =
    'https://quickswap.exchange/#/swap?inputCurrency=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&outputCurrency=' +
    helio.address;
  const buyHShareAddress =
    'https://quickswap.exchange/#/swap?outputCurrency=' +
    hShare.address;

  const helioLPStats = useMemo(() => (helioFtmLpStats ? helioFtmLpStats : null), [helioFtmLpStats]);
  const bshareLPStats = useMemo(() => (hShareFtmLpStats ? hShareFtmLpStats : null), [hShareFtmLpStats]);
  const helioPriceInDollars = useMemo(
    () => (helioStats ? Number(helioStats.priceInDollars).toFixed(2) : null),
    [helioStats],
  );
  const helioPriceInMATIC = useMemo(() => (helioStats ? Number(helioStats.tokenInETH).toFixed(4) : null), [helioStats]);
  const helioCirculatingSupply = useMemo(() => (helioStats ? String(helioStats.circulatingSupply) : null), [helioStats]);
  const helioTotalSupply = useMemo(() => (helioStats ? String(helioStats.totalSupply) : null), [helioStats]);

  const hSharePriceInDollars = useMemo(
    () => (hShareStats ? Number(hShareStats.priceInDollars).toFixed(2) : null),
    [hShareStats],
  );
  const hSharePriceInMATIC = useMemo(
    () => (hShareStats ? Number(hShareStats.tokenInETH).toFixed(4) : null),
    [hShareStats],
  );
  const hShareCirculatingSupply = useMemo(
    () => (hShareStats ? String(hShareStats.circulatingSupply) : null),
    [hShareStats],
  );
  const hShareTotalSupply = useMemo(() => (hShareStats ? String(hShareStats.totalSupply) : null), [hShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInMATIC = useMemo(() => (tBondStats ? Number(tBondStats.tokenInETH).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const helioLpZap = useZap({ depositTokenName: 'HELIO-ETH-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'HSHARE-MATIC-LP' });

  const [onPresentHelioZap, onDissmissHelioZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount, slippageBp) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        helioLpZap.onZap(zappingToken, tokenName, amount, slippageBp);
        onDissmissHelioZap();
      }}
      tokenName={'HELIO-ETH-LP'}
    />,
  );

  const [onPresentHshareZap, onDissmissHshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount, slippageBp) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount, slippageBp);
        onDissmissHshareZap();
      }}
      tokenName={'HSHARE-MATIC-LP'}
    />,
  );

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid
          item
          xs={12}
          sm={4}
          style={{ display: 'flex', justifyContent: 'center', verticalAlign: 'middle', overflow: 'hidden' }}
        >
          <img src={HelioImage} alt="helio-logo" style={{ maxHeight: '300px' }} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4} style={{ textAlign: 'center' }}>
              <h2>Welcome to Respect Finance</h2>
              <p>
                The algocoin that follows Ethereum's price! Now you can have high yields normally only found on risky assets, but with exposure to the world’s favorite cryptocurrency instead.
              </p>
              <p>
                <strong>RESPECT is pegged via algorithm to a 4,000:1 ratio to ETH. $4k ETH = $1 RESPECT PEG</strong>
                </p>
              <p>   Stake your RESPECT-ETH LP in the Farm to earn HSHARE rewards. Then stake your earned HSHARE in the
                Boardroom to earn more RESPECT! 
              </p>
              <p>
                <IconTelegram alt="telegram" style={{ fill: '#dddfee', height: '15px' }} /> Join our{' '}
                <a
                  href="https://t.me/HELIOCommunityPortal/3"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ color: '#dddfee' }}
                >
                  Telegram
                </a>{' '}
                to find out more!
              </p>
  
            </Box>
          </Paper>
          
        </Grid>


        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h2 style={{ paddingTop: '4px' }}>Total Value Locked</h2>
              <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
              <div style={{ paddingBottom: '0px' }}>{' '}</div>
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '1.8%', padding: '16px' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              {/* <Button href="/boardroom" className="shinyButton" style={{margin: '10px'}}>
                Stake Now
              </Button>*/}
              <Button href="/farm" className="shinyButton" style={{margin: '10px'}}>
                Farm Now
              </Button> 
              <Button
                target="_blank"
                href={buyHelioAddress}
                style={{ margin: '4px' }}
                className={'shinyButtonSecondary ' + classes.button}
              >
                Buy RESPECT
              </Button>
              <Button
                target="_blank"
                href={'https://dexscreener.com/polygon/0x0b4dd5A7A7377397aa1dFa12582f270fe0351770'}
                style={{ margin: '10px' }}
                className={'shinyButton ' + classes.button}
              >
                RESPECT Chart
              </Button>
              <Button
                target="_blank"
                href={buyHShareAddress}
                className={'shinyButtonSecondary ' + classes.button}
                style={{ margin: '4px' }}
              >
                Buy RSHARE
              </Button>
              <Button
                target="_blank"
                href={'https://dexscreener.com/polygon/0x8521F10339fA59417C90d3808426659b452a73E8'}
                className={'shinyButton ' + classes.button}
                style={{ margin: '10px' }}
              >
                RSHARE Chart
              </Button>
              { <Button
                target="_blank"
                href="https://docs.helio.cash/"
                className={'tutorial ' + classes.button}
                style={{ margin: '10px' }}
              >
                Docs
              </Button> }
             
            </CardContent>
          </Card>
        </Grid>

        {/* RESPECT */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="HELIOPNG" />
                </CardIcon>
              </Box>
              <Button
                onClick={() => {
                  helioFinance.watchAssetInMetamask('RESPECT');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <h2 style={{ marginBottom: '10px' }}>HELIO</h2>
              4,000 RESPECT (1.0 Peg) =
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>{helioPriceInMATIC ? helioPriceInMATIC : '-.----'} ETH</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${helioPriceInDollars ? roundAndFormatNumber(helioPriceInDollars, 2) : '-.--'} / RESPECT
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${roundAndFormatNumber(helioCirculatingSupply * helioPriceInDollars, 2)} <br />
                Circulating Supply: {roundAndFormatNumber(helioCirculatingSupply, 2)} <br />
                Total Supply: {roundAndFormatNumber(helioTotalSupply, 2)}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* RSHARE */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  helioFinance.watchAssetInMetamask('RSHARE');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="HSHARE" />
                </CardIcon>
              </Box>
              <h2 style={{ marginBottom: '10px' }}>RSHARE</h2>
              Current Price
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>
                  {hSharePriceInMATIC ? hSharePriceInMATIC : '-.----'} MATIC
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${hSharePriceInDollars ? hSharePriceInDollars : '-.--'} / RSHARE</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${roundAndFormatNumber((hShareCirculatingSupply * hSharePriceInDollars).toFixed(2), 2)}{' '}
                <br />
                Circulating Supply: {roundAndFormatNumber(hShareCirculatingSupply, 2)} <br />
                Total Supply: {roundAndFormatNumber(hShareTotalSupply, 2)}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* RBOND */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Button
                onClick={() => {
                  helioFinance.watchAssetInMetamask('RBOND');
                }}
                style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(100%)' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="RBOND" />
                </CardIcon>
              </Box>
              <h2 style={{ marginBottom: '10px' }}>HBOND</h2>
              4,000 RBOND
              <Box>
                <span style={{ fontSize: '30px', color: 'white' }}>
                  {tBondPriceInMATIC ? tBondPriceInMATIC : '-.----'} ETH
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'} / RBOND</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)} <br />
                Circulating Supply: {roundAndFormatNumber(tBondCirculatingSupply, 2)} <br />
                Total Supply: {roundAndFormatNumber(tBondTotalSupply, 2)}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ marginBottom: isMobile ? '0' : '5.1rem' }}>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="HELIO-ETH-LP" />
                </CardIcon>
              </Box>
              <h2>RESPECT-ETH QuickSwap LP</h2>
              <Box mt={2}>
                <Button onClick={onPresentHelioZap} className="shinyButtonSecondary">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {helioLPStats?.tokenAmount ? helioLPStats?.tokenAmount : '-.--'} HELIO /{' '}
                  {helioLPStats?.ftmAmount ? helioLPStats?.ftmAmount : '-.--'} ETH
                </span>
              </Box>
              <Box>${helioLPStats?.priceOfOne ? helioLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${helioLPStats?.totalLiquidity ? roundAndFormatNumber(helioLPStats.totalLiquidity, 2) : '-.--'}{' '}
                <br />
                Total Supply: {helioLPStats?.totalSupply ? roundAndFormatNumber(helioLPStats.totalSupply, 2) : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <Box mt={2}>
                <TokenSymbol symbol="HELIOPNG" />
                <span style={{ fontSize: '38px' }}>{' ♟️ '}</span>
                <TokenSymbol symbol="HSHARE" />
              </Box>
              <br />
              <h2>Execute Strategy</h2>
              <Box sx={{ width: 225 }}>
                <Typography
                  flexDirection={'row'}
                  flexGrow={1}
                  flexBasis={'space-between'}
                  display={'flex'}
                  sx={{ marginTop: '8px', whiteSpace: 'nowrap' }}
                  fontSize='12px'
                  gutterBottom>
                  <div style={{ flexDirection: 'column', textAlign: 'left' }}>
                    <b style={{ fontSize: '14px' }}>{boardroomValue}%</b>
                    <div>BOARDROOM</div>
                  </div>
                  <div style={{ width: '100%' }}>{' '}</div>
                  <div style={{ flexDirection: 'column', textAlign: 'right' }}>
                    <b style={{ fontSize: '14px' }}>{100 - boardroomValue}%</b>
                    <div>FARMS</div>
                  </div>
                </Typography>
                <Slider
                  // size='large'
                  aria-label="Stake boardroom"
                  defaultValue={20}
                  getAriaValueText={(t) => `${t}%`}
                  valueLabelDisplay="off"
                  value={boardroomValue}
                  onChange={handleBoardroomChange}
                  step={5}
                  marks
                  min={0}
                  max={40}
                />
                <Slider
                  // size='large'
                  aria-label="Zap ratio"
                  defaultValue={80}
                  getAriaValueText={(t) => `${t}%`}
                  valueLabelDisplay="off"
                  value={strategyValue}
                  onChange={handleStrategyChange}
                  step={5}
                  marks
                  min={60}
                  max={100}
                />
                <Typography
                  flexDirection={'row'}
                  flexGrow={1}
                  flexBasis={'space-between'}
                  display={'flex'}
                  sx={{ marginTop: '0', whiteSpace: 'nowrap' }}
                  fontSize='12px'
                  gutterBottom>
                  <div style={{ flexDirection: 'column', textAlign: 'left' }}>
                    <div>RESPECT-LP</div>
                    <b style={{ fontSize: '14px' }}>{strategyValue}%</b>
                  </div>
                  <div style={{ width: '100%' }}>{' '}</div>
                  <div style={{ flexDirection: 'column', textAlign: 'right' }}>
                    <div>RSHARE-LP</div>
                    <b style={{ fontSize: '14px' }}>{100 - strategyValue}%</b>
                  </div>
                </Typography>
                <Box mt={1}>
                  {!loading ?
                    <Button onClick={() => approvalStateStrategy === ApprovalState.APPROVED ? executeStrategy() : executeApprovals()} className="shinyButtonSecondary">
                      {approvalStateStrategy === ApprovalState.APPROVED ? 'Start' : 'Approve'}
                    </Button>
                    :
                    <div style={{ flexDirection: 'column', flexGrow: 1 }}>
                      <CircularProgress color='inherit' />
                      <div style={{ fontSize: '12px', marginTop: '12px', color: '#7e48aa' }}><i>Submitting multiple transactions...</i></div>
                    </div>
                  }
                </Box>
              </Box>
              {expanded ? <>
                <Box mt={2}>
                  <span style={{ fontSize: '26px' }}>
                    Strategy Info
                  </span>
                </Box>
                <Box mt={0.75} flexDirection={'row'} flexWrap={0}>
                  <span style={{ fontSize: '12px', flex: '1' }}>
                    Claim farm rewards <br />
                    Claim boardroom rewards <br />
                    Deposit into farms <br />
                    Deposit into boardroom <br />
                  </span>
                  <div style={{ marginTop: '12px', fontSize: '12px' }}>
                    <i>Disclaimer: Uses all liquid HELIO & HSHARES in wallet</i>
                  </div>
                  <Button size='small' style={{ marginTop: '16px', color: '#800080', marginBottom: '-5px' }} onClick={onToggleExpansion}>
                    Collapse
                  </Button>
                </Box>
              </>
                :
                <Button size='small' style={{ marginTop: '16px', color: '#800080', marginBottom: '-5px' }} onClick={onToggleExpansion}>
                  More Info
                </Button>}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ marginBottom: isMobile ? '0' : '3.35rem' }}>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="HSHARE-MATIC-LP" />
                </CardIcon>
              </Box>
              <h2>RSHARE-MATIC QuickSwap LP</h2>
              <Box mt={2}>
                <Button onClick={onPresentHshareZap} className="shinyButtonSecondary">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {bshareLPStats?.tokenAmount ? bshareLPStats?.tokenAmount : '-.--'} RSHARE /{' '}
                  {bshareLPStats?.ftmAmount ? bshareLPStats?.ftmAmount : '-.--'} MATIC
                </span>
              </Box>
              <Box>${bshareLPStats?.priceOfOne ? bshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: $
                {bshareLPStats?.totalLiquidity ? roundAndFormatNumber(bshareLPStats.totalLiquidity, 2) : '-.--'}
                <br />
                Total Supply: {bshareLPStats?.totalSupply ? roundAndFormatNumber(bshareLPStats.totalSupply, 2) : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
