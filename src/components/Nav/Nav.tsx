import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Container,
} from '@material-ui/core';

import ListItemLink from '../ListItemLink';
import useHelioStats from '../../hooks/useHelioStats';
import useEthStats from '../../hooks/useEthStats';
import useShareStats from '../../hooks/usehShareStats';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountButton from './AccountButton';

import helioLogo from '../../assets/img/helio-logo-final.png';
import { roundAndFormatNumber } from '../../0x';
import useMaticStats from '../../hooks/useMaticStats';
import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { ReactComponent as IconTwitter } from '../../assets/img/twitter.svg';
import { ReactComponent as IconGithub } from '../../assets/img/github.svg';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: '#7e48aa',
    'background-color': 'rgb(8, 9, 13, 0.9)',
    // borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '10px',
    marginBottom: '3rem',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    fontFamily: '"Poppins",sans-serif!important',
    fontSize: '0px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: '#7e48aa',
    fontSize: '14px',
    // fontWeight: 'bold',
    fontFamily: '"Poppins",sans-serif!important',
    marginTop: '15px',
    margin: theme.spacing(10, 1, 1, 2),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: '#d48b6',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '100%',
    color: 'white',
    backgroundColor: 'rgb(8, 9, 13, 0.9)',
    textAlign: 'center',
    height: '4.5rem',
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const helioStats = useHelioStats();
  const btcStats = useEthStats();
  const maticStats = useMaticStats();
  const shareStats = useShareStats();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const btcPriceInDollars = useMemo(() => (btcStats ? Number(btcStats).toFixed(2) : null), [btcStats]);
  const maticPriceInDollars = useMemo(() => (maticStats ? Number(maticStats).toFixed(2) : null), [maticStats]);
  const helioPriceInDollars = useMemo(
    () => (helioStats ? Number(helioStats.priceInDollars).toFixed(2) : null),
    [helioStats],
  );
  const sharePriceInDollars = useMemo(
    () => (shareStats ? Number(shareStats.priceInDollars).toFixed(2) : null),
    [shareStats],
  );

  return (
    <AppBar position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Typography variant="h6" color="inherit" noWrap style={{ flexGrow: '0', marginBottom: '-10px', marginLeft: '-10px' }} className={classes.toolbarTitle}>
              {/* <a className={ classes.brandLink } href="/">Helio Cash</a> */}
              <Link to="/" color="inherit" className={classes.brandLink}>
                <img alt="helio.cash" src={helioLogo} height="80px" />
              </Link>
            </Typography>
            <Box style={{ paddingLeft: '0', paddingTop: '2px', fontSize: '1rem', flexGrow: '1' }}>
              <Link to="/" className={'navLink ' + classes.link}>
                Home
              </Link>
              <Link to="/farm" className={'navLink ' + classes.link}>
                Farm
              </Link>
              
              <Link to="/farm/HelioMasterNode" className={'navLink ' + classes.link}>
                Nodes
              </Link>
              <Link to="/boardroom" className={'navLink ' + classes.link}>
                Boardroom
              </Link>
              <Link to="/bond" className={'navLink ' + classes.link}>
                Bond
              </Link>

              {/* <Link color="textPrimary" to="/sbs" className={classes.link}>
                SBS
              </Link> */}
              {/* <Link to="/liquidity" className={'navLink ' + classes.link}>
                Liquidity
              </Link> */}
              {/* <Link color="textPrimary" to="/regulations" className={classes.link}>
                Regulations
              </Link> */}
              <a href="https://vaults.helio.cash" className={'navLink ' + classes.link} rel="noopener noreferrer" target="_blank">
                AutoVaults
              </a>
              <a href="https://docs.helio.cash/" className={'navLink ' + classes.link} rel="noopener noreferrer" target="_blank">
                Docs
              </a>
              {/* <a href="https://docs.helio.cash/" className={'navLink ' + classes.link} rel="noopener" target="_blank">
                Docs
              </a> */}
            </Box>

            <Box
              style={{
                flexGrow: '0',
                paddingLeft: '0px',
                paddingTop: '0px',
                fontSize: '14px',
                // fontWeight: 'bold',
                fontFamily: '"Poppins",sans-serif!important',
                paddingRight: '6px',
                height: '30px',
                display: 'flex',
              }}
            >
              <a href="https://dexscreener.com/polygon/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', textDecoration: 'none' }}>
                <div className="navTokenIcon helio"></div>{' '}
                <div className="navTokenPrice">${roundAndFormatNumber(Number(helioPriceInDollars), 2)}</div>
              </a>
              <a href="https://dexscreener.com/polygon/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', textDecoration: 'none' }}>
                <div className="navTokenIcon bshare"></div>{' '}
                <div className="navTokenPrice">${roundAndFormatNumber(Number(sharePriceInDollars), 0)}</div>
              </a>
              <a href="https://dexscreener.com/polygon/0x45dda9cb7c25131df268515131f647d726f50608" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', textDecoration: 'none' }}>
                <div className="navTokenIcon btc"></div>{' '}
                <div className="navTokenPrice">${roundAndFormatNumber(Number(btcPriceInDollars), 0)}</div>
              </a>
              <a href="https://dexscreener.com/polygon/0xa374094527e1673a86de625aa59517c5de346d32" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', textDecoration: 'none' }}>
                <div className="navTokenIcon matic"></div>{' '}
                <div className="navTokenPrice">${roundAndFormatNumber(Number(maticPriceInDollars), 0)}</div>
              </a>
            </Box>
            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>

            <img
              alt="helio.cash"
              src={helioLogo}
              style={{ height: '60px', marginTop: '5px', marginLeft: '10px', marginRight: '15px' }}
            />
            <AccountButton text="Connect" />
            <Drawer
              className={classes.drawer}
              onEscapeKeyDown={handleDrawerClose}
              onBackdropClick={handleDrawerClose}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? (
                    <ChevronRightIcon htmlColor="white" />
                  ) : (
                    <ChevronLeftIcon htmlColor="white" />
                  )}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItem>
                  <AccountButton text="Connect" />
                </ListItem>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Farm" to="/farm" />
                <ListItemLink primary="Nodes" to="/farm/HelioMasterNode" />
                <ListItemLink primary="Boardroom" to="/boardroom" />
                <ListItemLink primary="Bond" to="/bond" />
                <ListItem button component="a" href="https://helio.cash/#">
                  <ListItemText>AutoVaults</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://docs.helio.cash/">
                  <ListItemText>Docs</ListItemText>
                </ListItem>
              </List>
              <footer className={classes.footer}>
                <Container maxWidth={false} style={{ padding: '0' }}>
                  <Grid item style={{ textAlign: 'left', height: '20px', padding: '0' }}>
                    <Box
                      style={{
                        flexGrow: '0',
                        paddingLeft: '8px',
                        paddingTop: '0px',
                        fontSize: '14px',
                        // fontWeight: 'bold',
                        fontFamily: '"Poppins",sans-serif!important',
                        height: '5px',
                        display: 'flex',
                      }}
                    >
                      <a href="https://dexscreener.com/bsc/0x84821bb588f049913dc579dc511e5e31eb22d5e4" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', textDecoration: 'none' }}>
                        <div className="navTokenIcon helio"></div>{' '}
                        <div className="navTokenPrice">${roundAndFormatNumber(Number(helioPriceInDollars), 2)}</div>
                      </a>
                      <a href="https://dexscreener.com/bsc/0x1747af98ebf0b22d500014c7dd52985d736337d2" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', textDecoration: 'none' }}>
                        <div className="navTokenIcon bshare"></div>{' '}
                        <div className="navTokenPrice">${roundAndFormatNumber(Number(sharePriceInDollars), 0)}</div>
                      </a>
                    </Box>
                    <div style={{ height: '45px' }}>{' '}</div>
                    <div>
                      <a
                        href="https://twitter.com/Helio_Cash"
                        rel="noopener noreferrer"
                        target="_blank"
                        className={classes.link}
                      >
                        <IconTwitter style={{ fill: '#dddfee' }} />
                      </a>
                      <a href="https://github.com/HelioCash/heliocash-frontend" rel="noopener noreferrer" target="_blank" className={classes.link}>
                        <IconGithub style={{ fill: '#dddfee', height: '20px' }} />
                      </a>
                      <a href="https://t.me/HELIO_Community" rel="noopener noreferrer" target="_blank" className={classes.link}>
                        <IconTelegram style={{ fill: '#dddfee', height: '20px' }} />
                      </a>
                    </div>
                  </Grid>
                </Container>
              </footer>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
