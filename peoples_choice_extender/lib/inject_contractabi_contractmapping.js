


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
        {"contractAddress":"0x64fc330fA8B6e0858F6f6e2427e22C55F373b327", "chainId": 501984}, //testnet
        {"contractAddress":"0x314AA36352771307E942FaeD6d8dfB2398916E92", "chainId": 534351}, //scroll
        {"contractAddress":"0x9A1554a110A593b5C137643529FAA258a710245C", "chainId": 245022926},
        {"contractAddress":"0xffC39C76C68834FE1149554Ccc1a76C2F1281beD", "chainId": 10200},
        {"contractAddress":"0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6", "chainId": 31337} //local docker 
  ]
;


