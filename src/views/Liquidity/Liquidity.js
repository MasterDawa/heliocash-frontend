import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/background.jpg';
import useLpStats from '../../hooks/useLpStats';
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import useRespectStats from '../../hooks/useRespectStats';
import TokenInput from '../../components/TokenInput';
import useRespectFinance from '../../hooks/useRespectFinance';
import { useWallet } from 'use-wallet';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import useApproveTaxOffice from '../../hooks/useApproveTaxOffice';
import { ApprovalState } from '../../hooks/useApprove';
import useProvideHelioEthLP from '../../hooks/useProvideRespectFtmLP';
import { Alert } from '@material-ui/lab';

const BackgroundImage = createGlobalStyle `
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
    const [respectAmount, setRespectAmount] = useState(0);
    const [ftmAmount, setFtmAmount] = useState(0);
    const [lpTokensAmount, setLpTokensAmount] = useState(0);
    const { balance } = useWallet();
    // const respectStats = useRespectStats();
    const respectFinance = useRespectFinance();
    const [approveTaxOfficeStatus0, approveTaxOfficeStatus1, approveTaxOffice] = useApproveTaxOffice();
    const respectBalance = useTokenBalance(respectFinance.HELIO);
    const ethBalance = useTokenBalance(respectFinance.ETH);

    const { onProvideHelioEthLP } = useProvideHelioEthLP();
    const respectFtmLpStats = useLpStats('RESPECT-ETH-LP');

    const respectLPStats = useMemo(() => (respectFtmLpStats ? respectFtmLpStats : null), [respectFtmLpStats]);
    // const respectPriceInETH = useMemo(() => (respectFtmLpStats ? Number(respectFtmLpStats.priceOfOne).toFixed(2) : null), [respectFtmLpStats]);
    // const ethPriceInRESPECT = useMemo(() => (respectFtmLpStats ? Number(respectFtmLpStats.ftmAmount).toFixed(2) : null), [respectFtmLpStats]);
    // const classes = useStyles();

    const handleRespectChange = async(e) => {
        if (!respectLPStats) return;
        if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
            setRespectAmount(e.currentTarget.value);
        }
        if (!isNumeric(e.currentTarget.value)) return;
        setRespectAmount(e.currentTarget.value);
        const quoteFromQuick = await respectFinance.quoteFromQuick(e.currentTarget.value, 'RESPECT');
        setFtmAmount(quoteFromQuick);
        setLpTokensAmount(quoteFromQuick / respectLPStats.ftmAmount);
    };

    const handleFtmChange = async(e) => {
        if (!respectLPStats) return;
        if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
            setFtmAmount(e.currentTarget.value);
        }
        if (!isNumeric(e.currentTarget.value)) return;
        setFtmAmount(e.currentTarget.value);
        const quoteFromQuick = await respectFinance.quoteFromQuick(e.currentTarget.value, 'ETH');
        setRespectAmount(quoteFromQuick);

        setLpTokensAmount(quoteFromQuick / respectLPStats.tokenAmount);
    };
    const handleRespectSelectMax = async() => {
        if (!respectLPStats) return;
        const quoteFromQuick = await respectFinance.quoteFromQuick(getDisplayBalance(respectBalance), 'RESPECT');
        setRespectAmount(getDisplayBalance(respectBalance));
        setFtmAmount(quoteFromQuick);
        setLpTokensAmount(quoteFromQuick / respectLPStats.ftmAmount);
    };
    const handleFtmSelectMax = async() => {
        if (!respectLPStats) return;
        const quoteFromQuick = await respectFinance.quoteFromQuick(getDisplayBalance(ethBalance), 'ETH');
        setFtmAmount(getDisplayBalance(ethBalance));
        setRespectAmount(quoteFromQuick);
        setLpTokensAmount(quoteFromQuick / respectLPStats.tokenAmount);
    };
    return ( <
        Page >
        <
        BackgroundImage / >
        <
        Typography color = "textPrimary"
        align = "center"
        variant = "h3"
        gutterBottom >
        Provide Liquidity <
        /Typography>

        <
        Grid container justify = "center" >
        <
        Box style = {
            { width: '600px' } } > {
            /* <Alert variant="filled" severity="warning" style={{marginBottom: '10px'}}>
                        <b>
                          This and{' '}
                          <a href="https://quickswap.exchange/#/" rel="noopener noreferrer" target="_blank">
                            Quickswap
                          </a>{' '}
                          are the only ways to provide Liquidity on HELIO-ETH pair without paying tax.
                        </b>
                      </Alert> */
        } <
        Grid item xs = { 12 }
        sm = { 12 } >
        <
        Paper >
        <
        Box mt = { 4 } >
        <
        Grid item xs = { 12 }
        sm = { 12 }
        style = {
            { borderRadius: 15 } } >
        <
        Box p = { 4 } >
        <
        Grid container >
        <
        Grid item xs = { 12 } >
        <
        TokenInput onSelectMax = { handleRespectSelectMax }
        onChange = { handleRespectChange }
        value = { respectAmount }
        max = { getDisplayBalance(respectBalance) }
        symbol = { 'RESPECT' } >
        < /TokenInput> <
        /Grid> <
        Grid item xs = { 12 } >
        <
        TokenInput onSelectMax = { handleFtmSelectMax }
        onChange = { handleFtmChange }
        value = { ftmAmount }
        max = { getDisplayBalance(ethBalance) }
        symbol = { 'ETH' } >
        < /TokenInput> <
        /Grid> <
        Grid item xs = { 12 } > { /* <p>1 RESPECT = {respectPriceInETH} ETH</p> */ } { /* <p>1 ETH = {ethPriceInRESPECT} RESPECT</p> */ } <
        p > LP tokens≈ { lpTokensAmount.toFixed(2) } < /p> <
        /Grid> <
        Grid xs = { 12 }
        justifyContent = "center"
        style = {
            { textAlign: 'center' } } > {
            approveTaxOfficeStatus0 === ApprovalState.APPROVED && approveTaxOfficeStatus1 === ApprovalState.APPROVED ? ( <
                Button variant = "contained"
                onClick = {
                    () => onProvideHelioEthLP(ftmAmount.toString(), respectAmount.toString()) }
                color = "primary"
                style = {
                    { margin: '0 10px', color: '#fff' } } >
                Supply <
                /Button>
            ) : ( <
                Button variant = "contained"
                onClick = {
                    () => approveTaxOffice() }
                color = "secondary"
                style = {
                    { margin: '0 10px' } } >
                Approve <
                /Button>
            )
        } <
        /Grid> <
        /Grid> <
        /Box> <
        /Grid> <
        /Box> <
        /Paper> <
        /Grid> <
        /Box> <
        /Grid> <
        /Page>
    );
};

export default ProvideLiquidity;