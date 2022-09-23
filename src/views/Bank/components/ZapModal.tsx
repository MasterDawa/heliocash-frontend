import React, { useState, useMemo } from 'react';

import { Button, Select, MenuItem, InputLabel, withStyles, Input } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import Label from '../../../components/Label';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useHelioFinance from '../../../hooks/useRespectFinance';
import { useWallet } from 'use-wallet';
import useApproveZapper, { ApprovalState } from '../../../hooks/useApproveZapper';
import { RESPECT_TICKER, RSHARE_TICKER, MATIC_TICKER, ETH_TICKER } from '../../../utils/constants';
import { Alert } from '@material-ui/lab';
import PercentInput from '../../../components/PercentInput';

interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, lpName: string, amount: string, slippageBp: string) => void;
  tokenName?: string;
  decimals?: number;
  showEstimates?: boolean;
}

const ZapModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, tokenName = '', decimals = 18, showEstimates = false }) => {
  const helioFinance = useRespectFinance();
  const { balance } = useWallet();
  const ftmBalance = (Number(balance) / 1e18).toFixed(4).toString();
  const respectBalance = useTokenBalance(respectFinance.RESPECT);
  const bshareBalance = useTokenBalance(respectFinance.RSHARE);
  const btcBalance = useTokenBalance(respectFinance.ETH);
  const [val, setVal] = useState('');
  const [slippage, setSlippage] = useState('2');
  const [zappingToken, setZappingToken] = useState(MATIC_TICKER);
  const [zappingTokenBalance, setZappingTokenBalance] = useState(ftmBalance);
  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' }); // token0 will always be MATIC in this case
  const [approveZapperStatus, approveZapper] = useApproveZapper(zappingToken);
  const respectFtmLpStats = useLpStats('RESPECT-ETH-LP');
  const tShareFtmLpStats = useLpStats('RSHARE-MATIC-LP');
  const RESPECTLPStats = useMemo(() => (respectFtmLpStats ? respectFtmLpStats : null), [respectFtmLpStats]);
  const bshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const ftmAmountPerLP = tokenName.startsWith(RESPECT_TICKER) ? respectLPStats?.ftmAmount : bshareLPStats?.ftmAmount;
  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  const handleChangeAsset = (event: any) => {
    const value = event.target.value;
    setZappingToken(value);
    setZappingTokenBalance(ftmBalance);
    if (event.target.value === RSHARE_TICKER) {
      setZappingTokenBalance(getDisplayBalance(bshareBalance, decimals));
    }
    if (event.target.value === RESPECT_TICKER) {
      setZappingTokenBalance(getDisplayBalance(respectBalance, decimals));
    }
    if (event.target.value === ETH_TICKER) {
      setZappingTokenBalance(getDisplayBalance(btcBalance, decimals));
    }
  };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      if (showEstimates) setEstimate({ token0: '0', token1: '0' });
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVal(e.currentTarget.value);
    if (showEstimates) {
      const estimateZap = await respectFinance.estimateZapIn(zappingToken, tokenName, String(e.currentTarget.value));
      setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
    }
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);
    if (showEstimates) {
      const estimateZap = await respectFinance.estimateZapIn(zappingToken, tokenName, String(zappingTokenBalance));
      setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
    }
  };

  return (
    <Modal>
      <ModalTitle text={`Zap in ${tokenName}`} />

      <StyledActionSpacer />
      <InputLabel style={{ color: '#7e48aa', marginBottom: '-1rem' }} id="label">
        Select Token
      </InputLabel>
      <br />
      <Select variant="outlined" onChange={handleChangeAsset} style={{ color: 'white', background: 'rgb(8, 9, 13, 1, 0.9)' }} labelId="label" id="select" value={zappingToken}>
        <StyledMenuItem value={MATIC_TICKER}>MATIC</StyledMenuItem>
        <StyledMenuItem value={ETH_TICKER}>ETH</StyledMenuItem>
        <StyledMenuItem value={RSHARE_TICKER}>RSHARE</StyledMenuItem>
        <StyledMenuItem value={RESPECT_TICKER}>RESPECT</StyledMenuItem>
      </Select>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zappingToken}
      />
      <br />
      {showEstimates && <><Label variant="yellow" text="Zap Estimations" />
        <br />
        <StyledDescriptionText>
          {' '}
          {tokenName}: {Number(estimate.token0) / Number(ftmAmountPerLP)}
        </StyledDescriptionText>
        {tokenName.startsWith(RESPECT_TICKER) ?
          <StyledDescriptionText>
            {' '}
            ({Number(estimate.token0)} {tokenName.startsWith(RESPECT_TICKER) ? ETH_TICKER : RESPECT_TICKER} /{' '}
            {Number(estimate.token1)} {tokenName.startsWith(RESPECT_TICKER) ? RESPECT_TICKER : ETH_TICKER}){' '}
          </StyledDescriptionText>
          :
          <StyledDescriptionText>
            {' '}
            ({Number(estimate.token0)} {tokenName.startsWith(RSHARE_TICKER) ? RSHARE_TICKER : MATIC_TICKER} /{' '}
            {Number(estimate.token1)} {tokenName.startsWith(RSHARE_TICKER) ? MATIC_TICKER : RSHARE_TICKER}){' '}
          </StyledDescriptionText>}
      </>}
      <InputLabel style={{ color: '#7e48aa', marginBottom: '1rem' }} id="label">
        Slippage Tolerance
      </InputLabel>
      <Input
        value={String(slippage)}
        onPointerDown={() => setSlippage('')}
        onBlur={() => !(slippage && isNumeric(slippage)) && setSlippage('2')}
        onChange={(e: any) => setSlippage(!!e.currentTarget.value && isNumeric(e.currentTarget.value) ? e.currentTarget.value : '')}
        placeholder="0"
        endAdornment={<div style={{ marginBottom: '1px' }}>%</div>}
        fullWidth={false}
        style={{ maxWidth: '2.5rem', marginLeft: '14px'}}
      />
      %
      <ModalActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() =>
            approveZapperStatus !== ApprovalState.APPROVED 
              ? approveZapper() 
              : onConfirm(zappingToken, tokenName, val, tokenName === 'RSHARE-MATIC-LP' ? '10000' : String(+slippage * 100))
          }
        >
          {approveZapperStatus !== ApprovalState.APPROVED ? 'Approve' : "Zap"}
        </Button>
      </ModalActions>

      {/* <StyledActionSpacer />
      <Alert variant="outlined" severity="info">
        New feature. Use at your own risk!
      </Alert> */}
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDescriptionText = styled.div`
  align-items: center;
  color: white;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 22px;
  justify-content: flex-start;
`;
const StyledMenuItem = withStyles({
  root: {
    backgroundColor: '#08090d',
    color: 'white',
    '&:hover': {
      backgroundColor: 'black',
      color: 'white',
    },
    selected: {
      backgroundColor: 'black',
    },
  },
})(MenuItem);

export default ZapModal;
