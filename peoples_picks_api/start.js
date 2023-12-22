const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const ethers = require('ethers');

const app = express();
const port = 3000;
const host = '0.0.0.0';

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_contractOwner",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "enum IDiamondCut.FacetCutAction",
            "name": "action",
            "type": "uint8"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "internalType": "struct IDiamondCut.FacetCut[]",
        "name": "_diamondCut",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "initContract",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "initData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Diamond.Initialization[]",
        "name": "_initializations",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "currentMonth",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "currentYear",
        "type": "uint16"
      }
    ],
    "name": "init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "donatedFinney",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "months",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "currentMonth",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "currentYear",
        "type": "uint16"
      }
    ],
    "name": "Donated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "shareFinney",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "transferDateId",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "transferFromDonationBucketPos",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "month",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "year",
        "type": "uint16"
      }
    ],
    "name": "RemovedFromDonationBucket",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "month",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "year",
        "type": "uint16"
      }
    ],
    "name": "TransferedFairShare",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "url",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "up",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "months",
        "type": "uint16"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint16",
        "name": "currentMonth",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "currentYear",
        "type": "uint16"
      }
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "setDonatingActive",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "setDonatingInactive",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "month",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "year",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "currentMonth",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "currentYear",
        "type": "uint16"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "url",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "up",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "uint16",
        "name": "currentMonth",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "currentYear",
        "type": "uint16"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "enum IDiamondCut.FacetCutAction",
            "name": "action",
            "type": "uint8"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "indexed": false,
        "internalType": "struct IDiamondCut.FacetCut[]",
        "name": "_diamondCut",
        "type": "tuple[]"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_init",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "_calldata",
        "type": "bytes"
      }
    ],
    "name": "DiamondCut",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "enum IDiamondCut.FacetCutAction",
            "name": "action",
            "type": "uint8"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "internalType": "struct IDiamondCut.FacetCut[]",
        "name": "_diamondCut",
        "type": "tuple[]"
      },
      {
        "internalType": "address",
        "name": "_init",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_calldata",
        "type": "bytes"
      }
    ],
    "name": "diamondCut",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner_",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "_functionSelector",
        "type": "bytes4"
      }
    ],
    "name": "facetAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "facetAddress_",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facetAddresses",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "facetAddresses_",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_facet",
        "type": "address"
      }
    ],
    "name": "facetFunctionSelectors",
    "outputs": [
      {
        "internalType": "bytes4[]",
        "name": "facetFunctionSelectors_",
        "type": "bytes4[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "internalType": "struct IDiamondLoupe.Facet[]",
        "name": "facets_",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "_interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const chainData = {
  "100": { //gnosis
    rpcurl: "https://rpc.gnosischain.com",
    contractAddress: '0x9e3B92A7762a810CCe3eF7cEb9B0177c595f463f',
    data: [],
    fromBlock: 31437570,
    lastBlockNumber: 31437570,
  },
  "501984": {
    rpcurl: "https://testnet.cryptng.xyz:8545",
    contractAddress: "0x188C8d37fb966713CbDc7cCc1A6ed3da060FFac3",
    data: [],
    fromBlock: 4110,
    lastBlockNumber: 4110,
    
  },
  "10200": {
    rpcurl: "https://rpc.chiadochain.net",
    contractAddress: "0xffC39C76C68834FE1149554Ccc1a76C2F1281beD",
    data: [],
    fromBlock: 7032222,
    lastBlockNumber: 7032222,
  },
  "534351": {
    rpcurl: "https://sepolia-rpc.scroll.io/",
    contractAddress: "0x314AA36352771307E942FaeD6d8dfB2398916E92",
    data: [],
    fromBlock: 2305820,
    lastBlockNumber: 2305820,
  },
  "245022926": {
    rpcurl: "https://devnet.neonevm.org",
    contractAddress: "0x9A1554a110A593b5C137643529FAA258a710245C",
    data: [],
    fromBlock: 259098931,
    lastBlockNumber: 259098931,
  }
};

console.log(chainData);
//loop through chainData object keys and add provider, contract and interfaces
Object.keys(chainData).forEach(key => {
  let chain = chainData[key];
  chain.provider = new ethers.JsonRpcProvider(chain.rpcurl);
  chain.contract = new ethers.Contract(chain.contractAddress, contractABI, chain.provider);
  chain.interface = chain.contract.interface;
})



app.use(cors());

let data = [];
let refreshInterval = 5;
let intervalId = null;
const itemsPerPage = 30;

app.get('/aggregate', async (req, res) => {
  try {
    const filterKeyword = req.query.filter;
    const page = req.query.p ? parseInt(req.query.p) : 1;
    const chainIdentifier = req.query.chain;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    if (chainIdentifier) {
      const selectedChain = chainData[chainIdentifier];
      console.log('aggregate started:');
      //console.log('selectedChain', selectedChain);
      console.log('page', page);


      if (selectedChain && selectedChain.data.length < endIndex+1) {
        // Change the active chain
        console.log(`Active chain changed to ${chainIdentifier}`);
        // Check if the chain data is already loaded
          await loadData(selectedChain);
          
        
  
      } else {
        return res.status(404).send('Chain identifier not found.');
      }
  

    // Filter data
    let filteredData = selectedChain.data;

    if (filterKeyword) {
      filteredData = selectedChain.data.filter(item => {
        const hostMatch = getHost(item.url).toLowerCase().includes(filterKeyword.toLowerCase());
        return hostMatch;
      });
      console.log('Filtered Data length:', filteredData.length);
    }
  
    // Calculate up and downvotes, totalVotes, and trend
    const urlVotesMap = new Map();
    let totalUpvotes = 0;
    let totalDownvotes = 0;

    filteredData.forEach(item => {
      const voteValue = item.upvote ? 1 : -1;

      if (!urlVotesMap.has(item.url)) {
        urlVotesMap.set(item.url, {
          url: item.url,
          upvotes: 0,
          downvotes: 0,
          totalVotes: 0,
          trend: null,
          title: item.title,
          host: getHost(item.url),
        });
      }

      const currentData = urlVotesMap.get(item.url);
      currentData.upvotes += item.upvote ? 1 : 0;
      currentData.downvotes += item.upvote ? 0 : 1;
      currentData.totalVotes += voteValue;
      urlVotesMap.set(item.url, currentData);

      totalUpvotes += item.upvote ? 1 : 0;
      totalDownvotes += item.upvote ? 0 : 1;
    });

    // Calculate trend
    urlVotesMap.forEach((value, key) => {
      value.trend = value.upvotes + value.downvotes;
      urlVotesMap.set(key, value);
    });

    const aggregatedData = Array.from(urlVotesMap.values());

    // Paginate data
    const paginatedData = aggregatedData.slice(startIndex, endIndex);
    console.log('Paginated data length:', paginatedData.length);

    res.json(paginatedData);
}
  } catch (error) {
    console.error('Error processing aggregate request:', error);
    res.status(500).send('Internal Server Error');
  }
  
});

// Refreshing stuff
app.get('/pp-load', (req, res) => {
  const interval = parseInt(req.query.interval);

  if (interval === -1) {
    // Stop refresh
    clearInterval(intervalId);
    refreshInterval = 0;
    res.send('Data refreshing stopped.');
  } else if (interval >= 0) {
    // set interval
    refreshInterval = interval;
    clearInterval(intervalId);
    intervalId = setInterval(loadData, refreshInterval * 1000);

    // Check if the chain data is already loaded
    if (activeChain.data.length === 0) {
      loadData();
    }

    res.send(`Data refreshing set to every ${interval} seconds.`);
  } else {
    res.status(400).send('Invalid interval parameter.');
  }
});

app.listen(port, host, () => {
    console.log(`Server running on http://localhost:${port}`);
});

function getHost(url) {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\?]+)/i);
    return match && match[1];
}

async function loadData(chain) {
  try {
    const newData = await getVoteEvents(chain);
    chain.data = [...chain.data, ...newData];
    console.log('Data loaded.');
    console.log('Refresh speed:' + refreshInterval);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

async function getVoteEvents(chain) {
    let events = [];
    try {
            const latestBlockNumber = await chain.provider.getBlockNumber();
            console.log('latestBlockNumber:'+latestBlockNumber);

            const eventFilter = chain.contract.filters.Voted();
            while(events.length<=30 &&  chain.fromBlock <= latestBlockNumber){
              eventFilter.fromBlock = chain.fromBlock;
              eventFilter.toBlock = chain.fromBlock + 500 < latestBlockNumber?chain.fromBlock + 500:latestBlockNumber;
              console.log(eventFilter);
              const logs = await chain.contract.queryFilter('Voted',eventFilter.fromBlock,eventFilter.toBlock) 
            
              console.log('Loading Initial Data...');
              console.log('new fromBlock1:', chain.fromBlock);
              for (const log of logs) {
              try {
                const data = chain.contract.interface.decodeEventLog("Voted", log.data);

                if (data.title !== '') {
                  events.push({url: data.url, upvote: data.up, title: data.title});
              } else {
                  console.warn('Empty title found in decoded data:', data);
              }
              } catch (error) {
                console.error('Error fetching at initial Load', error);
              }
              }
              chain.fromBlock=eventFilter.toBlock+1;
            }
      
    } catch (error) {
        console.error('Error fetching vote events:', error);
    }
    console.log('last block:'+(chain.fromBlock-1));
    return events;
}
