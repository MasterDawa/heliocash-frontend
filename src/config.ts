import {Configuration} from './helio-finance/config';
import {BankInfo} from './helio-finance';

const configurations: {[env: string]: Configuration} = {
  // development: {
  //   chainId: 8001,
  //   networkName: 'Mubmai Testnet',
  //   ftmscanUrl: 'https://mumbai.polygonscan.com/',
  //   defaultProvider: 'https://polygon-rpc.com/',
  //   deployments: require('./helio-finance/deployments/deployments.testing.json'),
  //   externalTokens: {
  //     WMATIC: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18],
  //     DAI: ['0x55d398326f99059fF775485246999027B3197955', 18],  
  //     ETH: ['0xd66c6b4f0be8ce5b39d52e0fd1344c389929b378', 18],
  //     'USDT-MATIC-LP': ['0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16', 18],
  //     'HELIO-ETH-LP': ['0x497D4b031d1A7fB76B75C99Ad0F9c86DbA7657Fb', 18],
  //     'HSHARE-MATIC-LP': ['0xa90ccF2E01Be627ef0Ac1533d482E182D56ebe32', 18],
  //   },
  //   baseLaunchDate: new Date('2021-11-21 1:00:00Z'),
  //   bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
  //   boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
  //   refreshInterval: 10000,
  // },
  development: {
    chainId: 137,
    networkName: 'Polygon Mainnet',
    ftmscanUrl: 'https://polygonscan.com',
    defaultProvider: 'https://polygon-rpc.com/',
    deployments: require('./helio-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WMATIC: ['0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18], 
      DAI: ['0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18], 
      ETH: ['0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18], 
      SVL: ['0x37F14E7c2FadC2A01dBD93b8a1F69D41c6c3d554', 18], //todo
      QUICK: ['0xB5C064F955D8e7F38fE0460C556a72987494eE17', 18],
      HELIO: ['0xB38B969f151E8217C917fE0532382172BB6Fb83E', 18],
      USDT: ['0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 6],
      'USDT-MATIC-LP': ['0x604229c960e5cacf2aaeac8be68ac07ba9df81c3', 18], 
      'USDT-ETH-LP': ['0xf6422b997c7f54d1c6a6e103bcb1499eea0a7046', 18], 
      'HELIO-ETH-LP': ['0x6C8bBA1618fF2ca8534b46465d3aE830602Cb511', 18],
      'HELIO-MATIC-LP': ['0x9D8365b4d00bF9b2cb570Da2a3f2363bea0bbF0C', 18], //todo
      'HSHARE-MATIC-LP': ['0x9D8365b4d00bF9b2cb570Da2a3f2363bea0bbF0C', 18],
      'HELIO-HSHARE-LP': ['0x2fa50016b979beeac3ef9242fe3031946b8f97e1', 18], //todo
      
    },
    baseLaunchDate: new Date('2022-01-17T23:00:00Z'),
    bondLaunchesAt: new Date('2022-01-31T23:00:00Z'),
    boardroomLaunchesAt: new Date('2022-01-21T01:00:00Z'),
    hsharesLaunchesAt: new Date('2022-01-20T01:00:00Z'),
    refreshInterval: 10000,
  },
  production: {
    chainId: 137,
    networkName: 'Polygon Mainnet',
    ftmscanUrl: 'https://polygonscan.com',
    defaultProvider: 'https://polygon-rpc.com/',
    deployments: require('./helio-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WMATIC: ['0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18],
      DAI: ['0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18],
      ETH: ['0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18],
      SVL: ['0x37F14E7c2FadC2A01dBD93b8a1F69D41c6c3d554', 18],
      QUICK: ['0xB5C064F955D8e7F38fE0460C556a72987494eE17', 18],
      HELIO: ['0xB38B969f151E8217C917fE0532382172BB6Fb83E', 18],
      USDT: ['0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 6],
      'USDT-MATIC-LP': ['0x604229c960e5cacf2aaeac8be68ac07ba9df81c3', 18],
      'USDT-ETH-LP': ['0xf6422b997c7f54d1c6a6e103bcb1499eea0a7046', 18],
      'HELIO-ETH-LP': ['0x6C8bBA1618fF2ca8534b46465d3aE830602Cb511', 18],
      'HELIO-MATIC-LP': ['0x9D8365b4d00bF9b2cb570Da2a3f2363bea0bbF0C', 18], /// TODO
      'HSHARE-MATIC-LP': ['0x9D8365b4d00bF9b2cb570Da2a3f2363bea0bbF0C', 18],
      'HELIO-HSHARE-LP': ['0x2fa50016b979beeac3ef9242fe3031946b8f97e1', 18], /// TODO

    },
    baseLaunchDate: new Date('2022-09-5T02:17:00Z'),
    bondLaunchesAt: new Date('2022-09-06T23:00:00Z'),
    boardroomLaunchesAt: new Date('2022-09-06T01:00:00Z'),
    hsharesLaunchesAt: new Date('2022-09-06T01:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: {[contractName: string]: BankInfo} = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding HELIO
        - 2 = LP asset staking rewarding HSHARE
        - 3 = HELIO Locker
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */


  HelioMasterNode: {
    name: 'Generate HELIO with Nodes',
    poolId: 4,
    sectionInUI: 3,
    contract: 'HelioMasterNode',
    depositTokenName: 'HELIO',
    earnTokenName: 'HELIO',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  


   HelioQuickRewardPool: {
     name: 'Earn HELIO by QUICK',
     poolId: 0,
     sectionInUI: 0,
     contract: 'HelioQUICKRewardPool',
     depositTokenName: 'QUICK',
     earnTokenName: 'HELIO',
     finished: false,
     sort: 3,
     closedForStaking: true,
   },
 

   HelioGenesisRewardPool: {
     name: 'Earn HELIO by QUICK',
     poolId: 1,
     sectionInUI: 0,
     contract: 'HelioGenesisRewardPool',
     depositTokenName: 'QUICK',
     earnTokenName: 'HELIO',
     finished: false,
     sort: 1,
     closedForStaking: false,
   },
   HelioWMATICGenesisRewardPool: {
     name: 'Earn HELIO by WMATIC',
     poolId: 0,
     sectionInUI: 0,
     contract: 'HelioWMATICGenesisRewardPool',
     depositTokenName: 'WMATIC',
     earnTokenName: 'HELIO',
     finished: false,
     sort: 1,
     closedForStaking: false,
   },
  // HelioMaticLPRewardPool: {
  //   name: 'Earn HELIO by HELIO-MATIC LP',
  //   poolId: 1,
  //   sectionInUI: 1,
  //   contract: 'HelioMaticLPRewardPool',
  //   depositTokenName: 'HELIO-MATIC-LP',
  //   earnTokenName: 'HELIO',
  //   finished: false,
  //   sort: 8,
  //   closedForStaking: false,
  // },
  

  HShareMaticHShareRewardPool: {
    name: 'Earn HSHARE by HSHARE-MATIC LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'HShareMaticHShareRewardPool',
    depositTokenName: 'HSHARE-MATIC-LP',
    earnTokenName: 'HSHARE',
    finished: false,
    sort: 8,
    closedForStaking: true,
  },
  HelioEthHShareRewardPool: {
    name: 'Earn HSHARE by HELIO-ETH LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'HelioEthHShareRewardPool',
    depositTokenName: 'HELIO-ETH-LP',
    earnTokenName: 'HSHARE',
    finished: false,
    sort: 7,
    closedForStaking: true,
  },
  HelioETHLPHelioRewardPool: {
    name: 'Earn HSHARE by HELIO-ETH LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'HelioETHLPHelioRewardPool',
    depositTokenName: 'HELIO-ETH-LP',
    earnTokenName: 'HELIO',
    finished: false,
    sort: 9,
    closedForStaking: true,
  },
  HelioHShareRewardPool: {
    name: 'Earn HSHARE by HELIO',
    poolId: 3,
    sectionInUI: 0,
    contract: 'HelioHShareRewardPool',
    depositTokenName: 'HELIO',
    earnTokenName: 'HSHARE',
    finished: true,
    sort: 9,
    closedForStaking: true,
  },

};

export default configurations[process.env.NODE_ENV || 'development'];
