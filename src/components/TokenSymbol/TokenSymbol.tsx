import React from 'react';

//Graveyard ecosystem logos
import helioLogo from '../../assets/img/helio-logo.png';
import tShareLogo from '../../assets/img/hshares-final2.png';
import helioLogoPNG from '../../assets/img/helio-logo.png';
import tShareLogoPNG from '../../assets/img/hshares-final2.png';
import tBondLogo from '../../assets/img/helio-bond-final.png';
import helioNodePNG from '../../assets/img/detonator.png';

import helioFtmLpLogo from '../../assets/img/HELIO-ETH-LP.png';
import helioHshareLpLogo from '../../assets/img/helio-hshares-lp.png';
import bshareFtmLpLogo from '../../assets/img/hshares-matic-lp.png';

import maticLogo from '../../assets/img/matic.png';
import btcLogo from '../../assets/img/eth-logo.png';

const logosBySymbol: {[title: string]: string} = {
  //Real tokens
  //=====================
  HELIO: helioLogo,
  HELIOPNG: helioLogoPNG,
  HSHAREPNG: tShareLogoPNG,
  HSHARE: tShareLogo,
  HBOND: tBondLogo,
  WMATIC: maticLogo,
  BOO: maticLogo,
  QUICK: maticLogo,
  DAI: maticLogo,
  SETH: btcLogo,
  ETH: btcLogo,
  SVL: maticLogo,
  HELIONODE: helioNodePNG,
  'ETH-MATIC-LP': helioFtmLpLogo,
  'HELIO-ETH-LP': helioFtmLpLogo,
  'HELIO-HSHARE-LP': helioHshareLpLogo,
  'HSHARE-MATIC-LP': bshareFtmLpLogo,
  'HSHARE-MATIC-APELP': bshareFtmLpLogo,
  'HELIO-ETH-APELP': helioFtmLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({symbol, size = 75}) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
