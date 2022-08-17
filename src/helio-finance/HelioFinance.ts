import { HSHARE_TICKER, ETH_TICKER } from './../utils/constants';
// import { Fetcher, Route, Token } from '@uniswap/sdk';
//import { Fetcher as FetcherSpirit, Token as TokenSpirit } from '@spiritswap/sdk';
import { Fetcher, Route, Token } from '@pancakeswap/sdk';
import { Contract as MultiContract, Provider } from 'ethers-multicall';
import { Configuration } from './config';
import { ContractName, TokenStat, AllocationTime, LPStat, Bank, PoolStats, HShareSwapperStat, Call } from './types';
import { BigNumber, Contract, ethers, EventFilter } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import config, { bankDefinitions } from '../config';
import moment from 'moment';
import { Interface, parseUnits } from 'ethers/lib/utils';
import { MATIC_TICKER, QUICK_ROUTER_ADDR, HELIO_TICKER } from '../utils/constants';
/**
 * An API module of Helio Cash contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class HelioFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  boardroomVersionOfUser?: string;

  HELIOETH_LP: Contract;

  HELIO: ERC20;
  HSHARE: ERC20;
  HBOND: ERC20;
  MATIC: ERC20;
  ETH: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this.HELIO = new ERC20(deployments.Helio.address, provider, 'HELIO');
    this.HSHARE = new ERC20(deployments.HShare.address, provider, 'HSHARE');
    this.HBOND = new ERC20(deployments.HBond.address, provider, 'HBOND');
    // this.HELIOETH = new ERC20(externalTokens['HELIO-ETH-LP'][0], provider, 'HELIO-ETH-LP');
    // this.HSHAREMATIC = new ERC20(externalTokens['HSHARE-MATIC-LP'][0], provider, 'HSHARE-MATIC-LP');
    this.MATIC = this.externalTokens['WMATIC'];
    this.ETH = this.externalTokens['ETH'];

    // Uniswap V2 Pair
    this.HELIOETH_LP = new Contract(externalTokens['HELIO-ETH-LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.HELIO, this.HSHARE, this.HBOND, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.HELIOETH_LP = this.HELIOETH_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchBoardroomVersionOfUser()
      .then((version) => (this.boardroomVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM APE TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getHelioStat(): Promise<TokenStat> {
    const { HelioRewardPool, HelioGenesisRewardPool, Treasury } = this.contracts;
    const [supply, circSupply, priceInETH, priceOfOneETH] = await Promise.all([
      this.HELIO.totalSupply(),
      Treasury.getHelioCirculatingSupply(),
      this.getTokenPriceFromQuickswapETH(this.HELIO),
      this.getETHPriceFromQuickswap()
    ]);

    // const priceInMATIC = await this.getTokenPriceFromQuickswap(this.HELIO);
    // const priceOfOneMATIC = await this.getWMATICPriceFromQuickswap();
    // const priceInDollars = await this.getTokenPriceFromQuickswapHELIOUSD();
    const priceOfHelioInDollars = ((Number(priceInETH) * Number(priceOfOneETH)) / 4000).toFixed(2);
    //console.log('priceOfHelioInDollars', priceOfHelioInDollars);

    return {
      tokenInETH: priceInETH ? priceInETH.toString() : '0',
      priceInDollars: priceOfHelioInDollars,
      totalSupply: getDisplayBalance(supply, this.HELIO.decimal, 0),
      circulatingSupply: getDisplayBalance(circSupply, this.HELIO.decimal, 0),
    };
  }

  async getETHPriceUSD(): Promise<Number> {
    const priceOfOneETH = await this.getETHPriceFromQuickswap();
    return Number(priceOfOneETH);
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('HELIO') ? this.HELIO : this.HSHARE;
    const isHelio = name.startsWith('HELIO');
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const ftmAmountBN = await this.MATIC.balanceOf(lpToken.address);
    const ftmAmount = getDisplayBalance(ftmAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const ftmAmountInOneLP = Number(ftmAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isHelio);
    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();
    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(2).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }

  async getLPStatETH(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('HELIO') ? this.HELIO : this.HSHARE;
    const isHelio = name.startsWith('HELIO');
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const btcAmountBN = await this.ETH.balanceOf(lpToken.address);
    const btcAmount = getDisplayBalance(btcAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const ftmAmountInOneLP = Number(btcAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isHelio);

    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();

    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();

    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(5).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }
  /**
   * Use this method to get price for Helio
   * @returns TokenStat for HBOND
   * priceInMATIC
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(version: number): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const helioStat = await this.getHelioStat();
    const bondHelioRatioBN = await Treasury.getBondPremiumRate();
    const modifier = bondHelioRatioBN / 1e18 > 1 ? bondHelioRatioBN / 1e18 : 1;
    const bondPriceInETH = (Number(helioStat.tokenInETH) * modifier).toFixed(2);
    const priceOfHBondInDollars = (Number(helioStat.priceInDollars) * modifier).toFixed(2);
    const supply = await this.HBOND.displayedTotalSupply();
    return {
      tokenInETH: bondPriceInETH,
      priceInDollars: priceOfHBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for HSHARE
   * priceInMATIC
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const { HShareRewardPool } = this.contracts;

    const supply = await this.HSHARE.totalSupply();

    const priceInMATIC = await this.getTokenPriceFromQuickswap(this.HSHARE);
    const helioRewardPoolSupply = await this.HSHARE.balanceOf(HShareRewardPool.address);
    const tShareCirculatingSupply = supply.sub(helioRewardPoolSupply);
    const priceOfOneMATIC = await this.getWMATICPriceFromQuickswap();
    const priceOfSharesInDollars = (Number(priceInMATIC) * Number(priceOfOneMATIC)).toFixed(2);

    return {
      tokenInETH: priceInMATIC,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this.HSHARE.decimal, 0),
      circulatingSupply: getDisplayBalance(tShareCirculatingSupply, this.HSHARE.decimal, 0),
    };
  }

  async getHelioStatInEstimatedTWAP(version: number): Promise<TokenStat> {
    const { Oracle, HelioRewardPool } = this.contracts;
    const expectedPrice = version === 0 ? await Oracle.twap(this.HELIO.address, ethers.utils.parseEther('4000')) : await Oracle.twap(this.HELIO.address, ethers.utils.parseEther('4000'));

    const supply = await this.HELIO.totalSupply();
    const helioRewardPoolSupply = await this.HELIO.balanceOf(HelioRewardPool.address);
    const helioCirculatingSupply = supply.sub(helioRewardPoolSupply);
    return {
      tokenInETH: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.HELIO.decimal, 0),
      circulatingSupply: getDisplayBalance(helioCirculatingSupply, this.HELIO.decimal, 0),
    };
  }

  async getHelioPriceInLastTWAP(version: number): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getHelioUpdatedPrice();
  }

  // async getHelioPegTWAP(): Promise<any> {
  //   const { Treasury } = this.contracts;
  //   const updatedPrice = Treasury.getHelioUpdatedPrice();
  //   const updatedPrice2 = updatedPrice * 10000;
  //   return updatedPrice2;
  // }

  async getBondsPurchasable(version: number): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    // const burnableHelio = (Number(Treasury.getBurnableHelioLeft()) * 1000).toFixed(2).toString();
    return Treasury.getBurnableHelioLeft();
  }

  async getNodes(contract: string, user: string): Promise<BigNumber[]> {
    return await this.contracts[contract].getNodes(user);
  }

  /**
   * Calculates the TVL, APR and daily APR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];

    if (bank.sectionInUI === 3) {
      const [depositTokenPrice, points, totalPoints, tierAmount, poolBalance, totalBalance, dripRate, dailyUserDrip] = await Promise.all([
        this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken),
        poolContract.tierAllocPoints(bank.poolId),
        poolContract.totalAllocPoints(),
        poolContract.tierAmounts(bank.poolId),
        poolContract.getHelioBalancePool(),
        depositToken.balanceOf(bank.address),
        poolContract.dripRate(),
        poolContract.getDayDripEstimate(this.myAccount),
      ]);
      const stakeAmount = Number(getDisplayBalance(tierAmount))
      // const userStakePrice = Number(depositTokenPrice) * Number(getDisplayBalance(user.total_deposits))

      const dailyDrip = totalPoints && +totalPoints > 0 
        ? getDisplayBalance(poolBalance.mul(BigNumber.from(86400)).mul(points).div(totalPoints).div(dripRate)) 
        : 0;
      const dailyDripAPR = (Number(dailyDrip) / stakeAmount) * 100;
      const yearlyDripAPR = (Number(dailyDrip) * 365 / stakeAmount) * 100;
      
      const dailyDripUser = Number(getDisplayBalance(dailyUserDrip));
      const yearlyDripUser = Number(dailyDripUser) * 365;
      // const dailyDripUserPricePerYear = Number(helioStat.priceInDollars) * Number(dailyDripUser);
      // const yearlyDripUserPricePerYear = Number(helioStat.priceInDollars) * Number(yearlyDripUser);
      // const dailyDripUserAPR = (dailyDripUserPricePerYear / userStakePrice) * 100;
      // const yearlyDripUserAPR = (yearlyDripUserPricePerYear / userStakePrice) * 100;
      
      const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(totalBalance, depositToken.decimal));

      return {
        userDailyBurst: dailyDripUser.toFixed(2).toString(),
        userYearlyBurst: yearlyDripUser.toFixed(2).toString(),
        dailyAPR: dailyDripAPR.toFixed(2).toString(),
        yearlyAPR: yearlyDripAPR.toFixed(2).toString(),
        TVL: TVL.toFixed(2).toString(),
      };
    } else {
      const [depositTokenPrice, stakeInPool, stat, tokenPerSecond] = await Promise.all([
        this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken),
        depositToken.balanceOf(bank.address),
        bank.earnTokenName === 'HELIO' ? this.getHelioStat() : this.getShareStat(),
        this.getTokenPerSecond(
          bank.earnTokenName,
          bank.contract,
          poolContract,
          bank.depositTokenName,
        )
      ]);
     
      const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));

      const tokenPerHour = tokenPerSecond.mul(60).mul(60);
      const totalRewardPricePerYear =
        Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
      const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
      const totalStakingTokenInPool =
        Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
      const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
      const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
      return {
        dailyAPR: dailyAPR.toFixed(2).toString(),
        yearlyAPR: yearlyAPR.toFixed(2).toString(),
        TVL: TVL.toFixed(2).toString(),
      };
    }
  }

  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */
  async getTokenPerSecond(
    earnTokenName: string,
    contractName: string,
    poolContract: Contract,
    depositTokenName: string,
  ) {
    if (contractName.endsWith('GenesisRewardPool')) {
      return await poolContract.helioPerSecond();
    }
    if (earnTokenName === 'HELIO') {
      if (!contractName.endsWith('HelioRewardPool') && !contractName.startsWith('HelioLocker')) {
        const rewardPerSecond = await poolContract.tSharePerSecond();
        if (depositTokenName === 'WMATIC') {
          return rewardPerSecond.mul(6000).div(11000).div(24);
        } else if (depositTokenName === 'QUICK') {
          return rewardPerSecond.mul(2500).div(11000).div(24);
        } else if (depositTokenName === 'DAI') {
          return rewardPerSecond.mul(1000).div(11000).div(24);
        } else if (depositTokenName === 'SVL') {
          return rewardPerSecond.mul(1500).div(11000).div(24);
        }
        return rewardPerSecond.div(24);
      }
      if (!contractName.startsWith('HelioLocker')) {
        const poolStartTime = await poolContract.poolStartTime();
        const startDateTime = new Date(poolStartTime.toNumber() * 1000);
        const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
        if (Date.now() - startDateTime.getTime() > FOUR_DAYS) {
          return await poolContract.epochHelioPerSecond(1);
        }
        return await poolContract.epochHelioPerSecond(0);
      } else {
        const poolStartTime = await poolContract.poolStartTime();
        const startDateTime = new Date(poolStartTime.toNumber() * 1000);
        const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
        if (Date.now() - startDateTime.getTime() > FOUR_DAYS) {
          return await poolContract.tierHelioPerSecond(1);
        }
        return await poolContract.tierHelioPerSecond(0);
      }
    }
    const rewardPerSecond = await poolContract.tSharePerSecond();
    if (depositTokenName === 'HELIO-ETH-LP') {
      return rewardPerSecond.mul(550).div(1000);
    } else if (depositTokenName === 'HELIO-HSHARE-LP') {
      return rewardPerSecond.mul(10).div(1000);
    } else if (depositTokenName === 'HELIO') {
      return rewardPerSecond.mul(0).div(1000)
    } else {
      return rewardPerSecond.mul(440).div(1000);
    }
  }

  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */
  async getDepositTokenPriceInDollars(tokenName: string, token: ERC20) {
    let tokenPrice;
    if (tokenName === 'WMATIC') {
      tokenPrice = await this.getWMATICPriceFromQuickswap();
    } else {
      if (tokenName === 'HELIO-ETH-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.HELIO, true);
      } else if (tokenName === 'HELIO-HSHARE-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.HELIO, true);
      } else if (tokenName === 'HSHARE-MATIC-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.HSHARE, false);
      } else if (tokenName === 'HSHARE-MATIC-APELP') {
        tokenPrice = await this.getApeLPTokenPrice(token, this.HSHARE, false);
      } else if (tokenName === 'HELIO-ETH-APELP') {
        tokenPrice = await this.getApeLPTokenPrice(token, this.HELIO, true);
      } else {
        const [priceToken, priceMATIC] = await Promise.all([
          this.getTokenPriceFromQuickswap(token),
          this.getWMATICPriceFromQuickswap()
        ]);
        tokenPrice = (Number(priceToken) * Number(priceMATIC)).toString();
      }
    }
    return tokenPrice;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(version: number): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(version: number): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(version: number, amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const treasuryHelioPrice = await Treasury.getHelioPrice();
    return Treasury.buyBonds(decimalToBalance(amount), treasuryHelioPrice);
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(version: number, amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const priceForHelio = await Treasury.getHelioPrice();
    return await Treasury.redeemBonds(decimalToBalance(amount), priceForHelio);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      const token = this.externalTokens[bankInfo.depositTokenName];
      const [tokenPrice, tokenAmountInPool] = await Promise.all([
        this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token),
        token.balanceOf(pool.address)
      ]);
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }

    const [shareStat, boardroomtShareBalance, lpStat, detonatorBalance] = await Promise.all([
      this.getShareStat(),
      this.HSHARE.balanceOf(this.currentBoardroom(1).address),
      this.getLPStat('HELIO-ETH-LP'),
      this.HELIOETH_LP.balanceOf(this.contracts.Detonator.address)
    ]);
    const HSHAREPrice = shareStat.priceInDollars;
    const LpPrice = lpStat.priceOfOne;
    const boardroomTVL = Number(getDisplayBalance(boardroomtShareBalance, this.HSHARE.decimal)) * Number(HSHAREPrice);
    const detonatorTVL = Number(getDisplayBalance(detonatorBalance, 18)) * Number(LpPrice);

    return totalValue + boardroomTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be MATIC in most cases)
   * @param isHelio sanity check for usage of helio token or tShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isHelio: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isHelio === true ? await this.getHelioStat() : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be MATIC in most cases)
   * @param isHelio sanity check for usage of helio token or tShare
   * @returns price of the LP token
   */
  async getApeLPTokenPrice(lpToken: ERC20, token: ERC20, isHelio: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isHelio === true ? await this.getHelioStat() : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === 'HELIO' && poolName.includes('Node')) {
        return await pool.getTotalRewards(account);
      } else if (earnTokenName === 'HELIO') {
        return await pool.pendingHELIO(poolId, account);
      } else {
        return await pool.pendingShare(poolId, account);
      }
    } catch (err) {
      console.error(`Failed to call pendingShare() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, sectionInUI: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = sectionInUI !== 3
        ? await pool.userInfo(poolId, account)
        : await pool.users(account);
      return sectionInUI !== 3
        ? await userInfo.amount
        : await userInfo.total_deposits;
    } catch (err) {
      console.error(`Failed to call userInfo() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }
  
  async claimedBalanceNode(poolName: ContractName, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.users(account);
      return await userInfo.total_claims;
    } catch (err) {
      console.error(`Failed to call userInfo() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }
  
  async getNodePrice(poolName: ContractName, poolId: Number): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.tierAmounts(poolId);
    } catch (err) {
      console.error(`Failed to call tierAmounts on contract ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, poolId: Number, sectionInUI: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return sectionInUI !== 3
      ? await pool.deposit(poolId, amount)
      : await pool.create(poolId, amount);
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName, poolId: Number, sectionInUI: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return sectionInUI !== 3
      ? await pool.withdraw(poolId, 0)
      : await pool.claim();
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchBoardroomVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentBoardroom(version: number): Contract {
    if (!this.boardroomVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Boardroom;
  }

  isOldBoardroomMember(): boolean {
    return this.boardroomVersionOfUser !== 'latest';
  }

  async getTokenPriceFromQuickswap(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    // const { chainId } = this.config;
    const { WMATIC } = this.config.externalTokens;

    const wftm = new Token(137, WMATIC[0], WMATIC[1], 'WMATIC');
    const token = new Token(137, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    try {
      const wftmToToken = await Fetcher.fetchPairData(wftm, token, this.provider);
      const priceInDAI = new Route([wftmToToken], token);
      return priceInDAI.midPrice.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceFromQuickswapETH(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    // const { chainId } = this.config;
    const { ETH, WMATIC } = this.config.externalTokens;

    const wmatic = new Token(137, WMATIC[0], WMATIC[1]);
    const eth = new Token(137, this.ETH.address, this.ETH.decimal, 'ETH', 'ETH');
    const token = new Token(137, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    try {
      const wftmToToken = await Fetcher.fetchPairData(eth, token, this.provider);
      const priceInDAI = new Route([wftmToToken], token);
      //   console.log('priceInDAIETH', priceInDAI.midPrice.toFixed(12));

      const priceForPeg = Number(priceInDAI.midPrice.toFixed(12)) * 4000;
      return priceForPeg.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceFromQuickswapHELIOUSD(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    // const { chainId } = this.config;
    const { HELIO, WMATIC } = this.config.externalTokens;

    const wmatic = new Token(137, WMATIC[0], WMATIC[1]);
    const eth = new Token(137, this.ETH.address, this.ETH.decimal, 'ETH', 'ETH');
    const token = new Token(137, this.HELIO.address, this.HELIO.decimal, this.HELIO.symbol);
    try {
      const wftmToToken = await Fetcher.fetchPairData(eth, token, this.provider);
      const priceInDAI = new Route([wftmToToken], token);
      // console.log('test', priceInDAI.midPrice.toFixed(12));

      const priceForPeg = Number(priceInDAI.midPrice.toFixed(12)) * 4000;
      return priceForPeg.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${this.HELIO.symbol}: ${err}`);
    }
  }


  async getWMATICPriceFromQuickswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WMATIC, DAI } = this.externalTokens;
    try {
      const dai_wftm_lp_pair = this.externalTokens['USDT-MATIC-LP'];
      let ftm_amount_BN = await WMATIC.balanceOf(dai_wftm_lp_pair.address);
      let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, WMATIC.decimal));
      let dai_amount_BN = await DAI.balanceOf(dai_wftm_lp_pair.address);
      let dai_amount = Number(getFullDisplayBalance(dai_amount_BN, DAI.decimal));
      return (dai_amount / ftm_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of WMATIC: ${err}`);
    }
  }

  async getETHPriceFromQuickswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { ETH } = this.externalTokens;
    try {
      const btcPriceInMATIC = await this.getTokenPriceFromQuickswap(ETH);

      const wmaticPrice = await this.getWMATICPriceFromQuickswap();

      const btcprice = (Number(btcPriceInMATIC) * Number(wmaticPrice)).toFixed(2).toString();
      //console.log('btcprice', btcprice);
      return btcprice;
    } catch (err) {
      console.error(`Failed to fetch token price of ETH: ${err}`);
    }
  }

  // async getETHPriceFromQuickswap(): Promise<string> {
  //   const ready = await this.provider.ready;
  //   if (!ready) return;
  //   const { ETH, DAI } = this.externalTokens;
  //   try {
  //     const dai_eth_lp_pair = this.externalTokens['USDT-ETH-LP'];
  //     let ftm_amount_BN = await ETH.balanceOf(dai_eth_lp_pair.address);
  //     let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, ETH.decimal));
  //     let dai_amount_BN = await DAI.balanceOf(dai_eth_lp_pair.address);
  //     let dai_amount = Number(getFullDisplayBalance(dai_amount_BN, DAI.decimal));
  //     console.log('ETH price', (dai_amount / ftm_amount).toString());
  //     return (dai_amount / ftm_amount).toString();
  //     console.log('ETH price');
  //   } catch (err) {
  //     console.error(`Failed to fetch token price of ETH: ${err}`);
  //   }
  // }

  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getBoardroomAPR(version: number) {
    const Boardroom = this.currentBoardroom(version);
    const [latestSnapshotIndex, shareStat, helioStat, boardroomtShareBalanceOf] = await Promise.all([
      Boardroom.latestSnapshotIndex(),
      this.getShareStat(),
      this.getHelioStat(),
      this.HSHARE.balanceOf(Boardroom.address),
    ]);

    const lastHistory = await Boardroom.boardroomHistory(latestSnapshotIndex);
    const lastRewardsReceived = lastHistory[1];
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    // Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(helioStat.priceInDollars) * 4;
    const boardroomTVL = Number(getDisplayBalance(boardroomtShareBalanceOf, this.HSHARE.decimal)) * Number(shareStat.priceInDollars);
    const realAPR = ((amountOfRewardsPerDay * 100) / boardroomTVL) * 365;
    return realAPR;
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Boardroom
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromBoardroom(version: number): Promise<boolean> {
    const Boardroom = this.currentBoardroom(version);
    return await Boardroom.canClaimReward(this.myAccount);
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Boardroom
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromBoardroom(version: number): Promise<boolean> {
    const Boardroom = this.currentBoardroom(version);
    const canWithdraw = await Boardroom.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnBoardroom(version);
    const notStaked = Number(getDisplayBalance(stakedAmount, this.HSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromBoardroom(): Promise<BigNumber> {
    // const Boardroom = this.currentBoardroom();
    // const mason = await Boardroom.masons(this.myAccount);
    return BigNumber.from(0);
  }

  async getTotalStakedInBoardroom(version: number): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom(version);
    return await Boardroom.totalSupply();
  }

  async stakeShareToBoardroom(version: number, amount: string): Promise<TransactionResponse> {
    if (this.isOldBoardroomMember()) {
      throw new Error("you're using old boardroom. please withdraw and deposit the HSHARE again.");
    }
    const Boardroom = this.currentBoardroom(version);
    return await Boardroom.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnBoardroom(version: number): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom(version);
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getShareOf(this.myAccount);
    }
    return await Boardroom.balanceOf(this.myAccount);
  }

  async getEarningsOnBoardroom(version: number): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom(version);
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getCashEarningsOf(this.myAccount);
    }
    return await Boardroom.earned(this.myAccount);
  }

  async withdrawShareFromBoardroom(version: number, amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom(version);
    return await Boardroom.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromBoardroom(version: number): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom(version);
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.claimDividends();
    }
    return await Boardroom.claimReward();
  }

  async exitFromBoardroom(version: number): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom(version);
    return await Boardroom.exit();
  }

  async getTreasuryNextAllocationTime(version: number): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the boardroom
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(version: number): Promise<AllocationTime> {
    const { Boardroom, Treasury } = this.contracts;
    const selectedBoardroom = Boardroom;
    const nextEpochTimestamp = await selectedBoardroom.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await selectedBoardroom.epoch();
    const mason = await selectedBoardroom.members(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await selectedBoardroom.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the boardroom
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(version: number): Promise<AllocationTime> {
    const { Boardroom, Treasury } = this.contracts;
    const selectedBoardroom = Boardroom;
    const nextEpochTimestamp = await selectedBoardroom.nextEpochPoint();
    const currentEpoch = await selectedBoardroom.epoch();
    const mason = await selectedBoardroom.members(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await selectedBoardroom.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnBoardroom(version);
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async watchAssetInMetamask(assetName: string): Promise<boolean> {
    const { ethereum } = window as any;
    if (ethereum && ethereum.networkVersion === config.chainId.toString()) {
      let asset;
      let assetUrl;
      if (assetName === 'HELIO') {
        asset = this.HELIO;
        assetUrl = 'https://helio.cash/assets/img/helio-logo.png';
      } else if (assetName === 'HSHARE') {
        asset = this.HSHARE;
        assetUrl = 'https://helio.cash/assets/img/hshares-final2.png';
      } else if (assetName === 'HBOND') {
        asset = this.HBOND;
        assetUrl = 'https://helio.cash/assets/img/helio-bond-final.png';
      }
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.address,
            symbol: asset.symbol,
            decimals: 18,
            image: assetUrl,
          },
        },
      });
    }
    return true;
  }

  async provideHelioEthLP(ethAmount: BigNumber, helioAmount: BigNumber): Promise<TransactionResponse> {
    const { TaxOfficeV2 } = this.contracts;
    // let overrides = {
    //   value: parseUnits(ftmAmount, 18),
    // };
    return await TaxOfficeV2.addLiquidityTaxFree(
      this.ETH.address,
      helioAmount,
      ethAmount,
      helioAmount.mul(980).div(1000),
      ethAmount.mul(980).div(1000),
      // overrides,
    );
  }

  async quoteFromQuick(tokenAmount: string, tokenName: string): Promise<string> {
    const { QuickRouter } = this.contracts;
    const { _reserve0, _reserve1 } = await this.HELIOETH_LP.getReserves();
    let quote;
    if (tokenName === 'HELIO') {
      quote = await QuickRouter.quote(parseUnits(tokenAmount), _reserve1, _reserve0);
    } else {
      quote = await QuickRouter.quote(parseUnits(tokenAmount), _reserve0, _reserve1);
    }
    return (quote / 1e18).toString();
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
  async listenForRegulationsEvents(version: number): Promise<any> {
    const { Treasury } = this.contracts;

    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryBoardroomFundedFilter = Treasury.filters.BoardroomFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    let epochBlocksRanges: any[] = [];
    let boardroomFundEvents = await Treasury.queryFilter(treasuryBoardroomFundedFilter);
    var events: any[] = [];
    boardroomFundEvents.forEach(function callback(value, index) {
      events.push({ epoch: index + 1 });
      events[index].boardroomFund = getDisplayBalance(value.args[1]);
      if (index === 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
      }
      if (index > 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
        epochBlocksRanges[index - 1].endBlock = value.blockNumber;
      }
    });

    epochBlocksRanges.forEach(async (value, index) => {
      events[index].bondsBought = await this.getBondsWithFilterForPeriod(
        version,
        boughtBondsFilter,
        value.startBlock,
        value.endBlock,
      );
      events[index].bondsRedeemed = await this.getBondsWithFilterForPeriod(
        version,
        redeemBondsFilter,
        value.startBlock,
        value.endBlock,
      );
    });
    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });
    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });
    return events;
  }

  /**
   * Helper method
   * @param filter applied on the query to the treasury events
   * @param from block number
   * @param to block number
   * @returns the amount of bonds events emitted based on the filter provided during a specific period
   */
  async getBondsWithFilterForPeriod(version: number, filter: EventFilter, from: number, to: number): Promise<number> {
    const { Treasury } = this.contracts;
    const bondsAmount = await Treasury.queryFilter(filter, from, to);
    return bondsAmount.length;
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { Zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (tokenName === MATIC_TICKER) {
      estimate = await Zapper.estimateZapIn(lpToken.address, QUICK_ROUTER_ADDR, parseUnits(amount, 18));
    } else {
      let token: ERC20;
      switch (tokenName) {
        case HELIO_TICKER: token = this.HELIO; break;
        case HSHARE_TICKER: token = this.HSHARE; break;
        case ETH_TICKER: token = this.ETH; break;
        default: token = null;
      }
      estimate = await Zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        QUICK_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    }
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string, slippageBp: string): Promise<TransactionResponse> {
    const { ZapperV2 } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    if (tokenName === MATIC_TICKER) {
      let overrides = {
        value: parseUnits(amount, 18),
        gasLimit: '1500000'
      };
      return await ZapperV2.zapMATICToLP(lpToken.address, overrides);

    } else {
      let token: ERC20;
      switch (tokenName) {
        case HELIO_TICKER: token = this.HELIO; break;
        case HSHARE_TICKER: token = this.HSHARE; break;
        case ETH_TICKER: token = this.ETH; break;
        default: token = null;
      }

      return await ZapperV2.zapTokenToLP(
        token.address,
        parseUnits(amount, 18),
        lpToken.address,
        { gasLimit: '1500000' }
      );
    }
  }

  async zapStrategy(from: string, amount: string | BigNumber, percentHelioLP: string | number | BigNumber, gasLimit?: BigNumber): Promise<TransactionResponse> {
    const { Strategy } = this.contracts;
    if (gasLimit)
      return await Strategy.zapStrategy(from, amount, percentHelioLP, { gasLimit: gasLimit.toNumber() });
    else
      return await Strategy.zapStrategy(from, amount, percentHelioLP);
  }

  async swapHBondToHShare(bbondAmount: BigNumber): Promise<TransactionResponse> {
    const { HShareSwapper } = this.contracts;
    return await HShareSwapper.swapHBondToHShare(bbondAmount);
  }
  async estimateAmountOfHShare(bbondAmount: string): Promise<string> {
    const { HShareSwapper } = this.contracts;
    try {
      const estimateBN = await HShareSwapper.estimateAmountOfHShare(parseUnits(bbondAmount, 18));
      return getDisplayBalance(estimateBN, 18, 6);
    } catch (err) {
      console.error(`Failed to fetch estimate bshare amount: ${err}`);
    }
  }

  async getHShareSwapperStat(address: string): Promise<HShareSwapperStat> {
    const { HShareSwapper } = this.contracts;
    const bshareBalanceBN = await HShareSwapper.getHShareBalance();
    const bbondBalanceBN = await HShareSwapper.getHBondBalance(address);
    // const helioPriceBN = await HShareSwapper.getHelioPrice();
    // const bsharePriceBN = await HShareSwapper.getHSharePrice();
    const rateHSharePerHelioBN = await HShareSwapper.getHShareAmountPerHelio();
    const bshareBalance = getDisplayBalance(bshareBalanceBN, 18, 5);
    const bbondBalance = getDisplayBalance(bbondBalanceBN, 18, 5);
    return {
      bshareBalance: bshareBalance.toString(),
      bbondBalance: bbondBalance.toString(),
      // helioPrice: helioPriceBN.toString(),
      // bsharePrice: bsharePriceBN.toString(),
      rateHSharePerHelio: rateHSharePerHelioBN.toString(),
    };
  }
}
