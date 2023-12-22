contractABI=[
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