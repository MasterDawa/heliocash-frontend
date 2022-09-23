import React from 'react';

//Graveyard ecosystem logos
import respectLogo from '../../assets/img/respect-logo.png';
import tShareLogo from '../../assets/img/rshares-final2.png';
import respectLogoPNG from '../../assets/img/respect-logo.png';
import tShareLogoPNG from '../../assets/img/rshares-final2.png';
import tBondLogo from '../../assets/img/respect-bond-final.png';
import respectNodePNG from '../../assets/img/detonator.png';

import respectFtmLpLogo from '../../assets/img/RESPECT-ETH-LP.png';
import respectRshareLpLogo from '../../assets/img/respect-rshares-lp.png';
import bshareFtmLpLogo from '../../assets/img/rshares-matic-lp.png';

import maticLogo from '../../assets/img/matic.png';
import btcLogo from '../../assets/img/eth-logo.png';

const logosBySymbol: {[title: string]: string} = {
  //Real tokens
  //=====================
  RESPECT: respectLogo,
  RESPECTPNG: respectLogoPNG,
  RSHAREPNG: tShareLogoPNG,
  RSHARE: tShareLogo,
  RBOND: tBondLogo,
  WMATIC: maticLogo,
  BOO: maticLogo,
  QUICK: maticLogo,
  DAI: maticLogo,
  SETH: btcLogo,
  ETH: btcLogo,
  SVL: maticLogo,
  RESPECTNODE: respectNodePNG,
  'ETH-MATIC-LP': respectFtmLpLogo,
  'RESPECT-ETH-LP': respectFtmLpLogo,
  'RESPECT-RSHARE-LP': respectRshareLpLogo,
  'RSHARE-MATIC-LP': bshareFtmLpLogo,
  'RSHARE-MATIC-APELP': bshareFtmLpLogo,
  'RESPECT-ETH-APELP': respectFtmLpLogo,
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
