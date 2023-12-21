

// Global variables to store the contract ABI and address mapping
let contractAddress, provider, signer, contract;

// Initiates the contract by setting up the provider, signer, and contract instance
async function initiateContract()
{
  
provider = new ethers.BrowserProvider(window.ethereum);
signer = await provider.getSigner();


// Get the current chain ID from MetaMask
const chainId = Number((await provider.getNetwork()).chainId);

// Find the contract address corresponding to the current chain ID
const mapping = contractAddressMapping.find(m => m.chainId === chainId);
if (!mapping) {
  console.log('chainid not found in mapping: '+chainId);
  throw new Error(`Contract address not found for chain ID ${chainId}`);
}

contractAddress = mapping.contractAddress;

contract = new ethers.Contract(contractAddress, contractABI, signer);
}

// Check for window.ethereum and log the status
if (window.ethereum) {
  console.log('window.ethereum is available');
  window.postMessage({ type: "FROM_PAGE", text: "window.ethereum is available" }, "*");
} else {
  console.log('window.ethereum is not available');
  window.postMessage({ type: "FROM_PAGE", text: "window.ethereum is not available" }, "*");
}


// Retrieve current chain name and ID
async function getCurrentChainNameAndId() { 
  await initiateContract();
  const network = await provider.getNetwork();
  return { chainId: network.chainId, chainName: network.name };
}

// Function to convert decimal values to BigInt, used for Ethereum transactions
function multiplyDecimalWithBigInt(decimal, bigInt) {
  const decimalPlaces = (decimal.toString().split('.')[1] || '').length;
  const scaleFactor = 10 ** decimalPlaces;
  const scaledDecimal = BigInt(Math.round(decimal * scaleFactor));
  return (scaledDecimal * bigInt) / BigInt(scaleFactor);
}

// Function to handle voting transactions
async function callContractFunctionForVote(receiver, url, upvote, title, handle) {
  if (!ethereum.isMetaMask) {
      console.error('MetaMask is not available');
      return;
  }


  await initiateContract();

  if(receiver == '0x0000000000000000000000000000000000000000')
  {
    console.log('RECEIVER IS NULL ADDRESS');
    const interim = keccak256('youtube.com/@' +handle);  //todo check if the @ already is there
    console.log('INTERIM: ' + interim);
    const magicBits = BigInt(0xf000000000000000000000000000000000000000000000000000000000);
    console.log('receiver: ' + receiver);
    receiver = (BigInt(receiver)  >> 96n) | magicBits
  }



  try {
      const transaction = await contract.vote(url, upvote, receiver, title);
      console.log('Vote transaction sent:', transaction.hash);
      await transaction.wait();
      console.log('Vote transaction confirmed');
  } catch (error) {
      console.error('Vote transaction failed:', error);
  }
}



const contractABI = [
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
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "month",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "year",
        "type": "uint16"
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
      }
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "donationBuckets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint16",
            "name": "startMonth",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "startYear",
            "type": "uint16"
          },
          {
            "internalType": "uint32[48]",
            "name": "donationBuckets",
            "type": "uint32[48]"
          }
        ],
        "internalType": "struct PeoplesPlatformFacet.DonationBuckets",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "myFame",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
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
    "inputs": [],
    "name": "totalFame",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
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
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let contractAddressMapping = 
  
    [
        {"contractAddress":"0x9e3B92A7762a810CCe3eF7cEb9B0177c595f463f", "chainId": 100}, //gnosis
        {"contractAddress":"0x188C8d37fb966713CbDc7cCc1A6ed3da060FFac3", "chainId": 501984}, //testnet
        {"contractAddress":"0x314AA36352771307E942FaeD6d8dfB2398916E92", "chainId": 534351}, //scroll
        {"contractAddress":"0x9A1554a110A593b5C137643529FAA258a710245C", "chainId": 245022926},
        {"contractAddress":"0xffC39C76C68834FE1149554Ccc1a76C2F1281beD", "chainId": 10200},
        {"contractAddress":"0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6", "chainId": 31337} //local docker 
  ]
;

