
let contractAddressMapping = 
[
    {"contractAddress":"0x9e3B92A7762a810CCe3eF7cEb9B0177c595f463f", "chainId": 100}, //gnosis
    {"contractAddress":"0x188C8d37fb966713CbDc7cCc1A6ed3da060FFac3", "chainId": 501984}, //testnet
    {"contractAddress":"0x314AA36352771307E942FaeD6d8dfB2398916E92", "chainId": 534351}, //scroll
    {"contractAddress":"0x9A1554a110A593b5C137643529FAA258a710245C", "chainId": 245022926},
    {"contractAddress":"0xffC39C76C68834FE1149554Ccc1a76C2F1281beD", "chainId": 10200},
    {"contractAddress":"0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6", "chainId": 31337} //local docker 
];

let contractAddress;


let provider ;
let _provider;
let signer ;
let signerAddress ;
let contract ;
let _contract ;

let lastVotedBlock=0;
let lastDonatedBlock=0;

let cachedVoted=[];
let cachedDonated=[];

let ethers;

async function initiateContract()
{
    
    
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    signerAddress= await signer.getAddress();

    
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

async function directContract(){
    _provider = new ethers.JsonRpcProvider('https://rpc.gnosischain.com',100n,{mode:'cors'});

    const chainId = Number((await _provider.getNetwork()).chainId);

    // Find the contract address corresponding to the current chain ID
    const mapping = contractAddressMapping.find(m => m.chainId === chainId);
    if (!mapping) {
        console.log('chainid not found in mapping: '+chainId);
        throw new Error(`Contract address not found for chain ID ${chainId}`);
    }

    contractAddress = mapping.contractAddress;

    _contract = new ethers.Contract(contractAddress,contractABI,_provider);
}

window.ethereum = window.ethereum || {};


function getCurrentChainNameAndId()
{ 
    initiateContract().then(()=>{
        provider.getNetwork().then((network)=>{
            const chainId =Number(network.chainId);
            const chainName = network.name;

        });
        
    });
    
}



async function asyncGetDonations(){
    let currentMonth0Based = (new Date()).getMonth();
    let curYear = (new Date()).getFullYear();
    try {
        const donationBuckets = await _contract.donationBuckets();
        const maxDonation = Math.max(...donationBuckets.donationBuckets.map((b)=>Number(b)));
        const startDateId = Number(donationBuckets.startYear)*12+Number(donationBuckets.startMonth)-1;
        const currentDateId = (curYear*12+currentMonth0Based);
        const currentRelativeDateId = currentDateId-startDateId;
        const currentBucketPos = currentRelativeDateId % 48;
        let donations = [];
        for (let i = currentRelativeDateId-23; i <= currentRelativeDateId + 24; i++) {
       
            const bucket =Number(donationBuckets.donationBuckets[i<0?48+i:i]);
            donations.push({
                value:bucket,
                relValue:maxDonation===0?0:bucket/maxDonation,
                year:Math.trunc((currentDateId+i-currentRelativeDateId)/12),
                month:(currentDateId+i-currentRelativeDateId)%12
            });
        }
        return donations;
    } catch (error) {
        console.error(error);
    }
}

async function asyncGetVotes(){
   
    try {
        const toBlock=await _provider.getBlockNumber();
        const fromBlock=lastVotedBlock === 0 ? 0:lastVotedBlock;
        if(fromBlock===toBlock) return cachedVoted;
        lastVotedBlock=toBlock;
        let events = await _contract.queryFilter('Voted',0, toBlock);

    
        let votes=cachedVoted;
        console.debug(events);
        for (const log of events) {
        const logId = log.blockNumber * 100000+ log.index;
        const data = _contract.interface.decodeEventLog("Voted",log.data);
        console.log(`url:${data.url},up:${data.up},title:${data.title},receiver:${data.receiver},sender:${data.sender},month:${data.month},year:${data.year}`);
        data.logId=logId;
        data.year =Number(data.year);
        if(cachedVoted.filter((awd)=>awd.logId===logId).length===0) votes.push({
            url:data.url,
            up:data.up,
            title:data.title,
            receiver:data.receiver,
            sender:data.sender,
            month:Number(data.month),
            year:Number(data.year),
            logId:logId
        });
        }
        
        cachedVoted=votes;
        
        return cachedVoted;

    } catch (error) {
        console.error(error);
    }
}
async function asyncGetDonated(){
   
   try {
       const toBlock=await _provider.getBlockNumber();
       const fromBlock=lastDonatedBlock === 0 ? 0:lastDonatedBlock;
       if(fromBlock===toBlock) return cachedVoted;
       lastDonatedBlock=toBlock;
       let events = await _contract.queryFilter('Donated',fromBlock, toBlock);

   
       let donated=cachedDonated;
       console.debug(events);
       for (const log of events) {
       const logId = log.blockNumber * 100000+ log.index;
       const data = _contract.interface.decodeEventLog("Donated",log.data);
       console.log(`donatedFinney:${data.donatedFinney},name:${data.name},months:${data.months},currentMonth:${data.currentMonth},currentYear:${data.currentYear}`);
       data.logId=logId;
       if(cachedDonated.filter((awd)=>awd.logId===logId).length===0) donated.push({
            donatedFinney:data.donatedFinney,
            name:data.name,
            month:data.currentMonth,
            year:data.currentYear,
           logId:logId
       });
       }
       
       cachedDonated=donated;
       
       return cachedDonated;

   } catch (error) {
       console.error(error);
   }
}

function populate(){
    asyncGetDonations().then((donations)=>{
        updateDonations(donations);
    });

    asyncGetVotes().then((votes)=>{
     
        let votesGrpByDate = votes.reduce((a,c)=>{
            let data = a[`id${c.year*12+c.month-1}`];
            if(data=== undefined){
                data={
                    month:c.month,
                    year:c.year,
                    votes:[c],
                    sumVotes:c.up?1:-1
                }
                a[`id${c.year*12+c.month-1}`]=data;
            }else{
                data.votes.push(c);
                data.sumVotes+=c.up?1:-1;
            }
            return a;
        },{});
        const maxVotesCount = Math.max(Object.keys(votesGrpByDate).map((k)=>votesGrpByDate[k].votes.length));
        Object.keys(votesGrpByDate).forEach((k)=>{
            votesGrpByDate[k].relVotesLength=votesGrpByDate[k].votes.length/maxVotesCount;
            votesGrpByDate[k].uniqueContent=votesGrpByDate[k].votes.reduce((a,c)=>{
                if( a.contentHash.indexOf(c.url)===-1){
                    a.contentHash.push(c.url);
                    a.count++;
                }
                return a;
            },{contentHash:[],count:0}).count;
            votesGrpByDate[k].uniqueSender=votesGrpByDate[k].votes.reduce((a,c)=>{
                if( a.contentHash.indexOf(c.sender)===-1){
                    a.contentHash.push(c.sender);
                    a.count++;
                }
                return a;
            },{contentHash:[],count:0}).count;
            votesGrpByDate[k].uniqueReceiver=votesGrpByDate[k].votes.reduce((a,c)=>{
                if( a.contentHash.indexOf(c.receiver)===-1){
                    a.contentHash.push(c.receiver);
                    a.count++;
                }
                return a;
            },{contentHash:[],count:0}).count;
            if(signerAddress!==undefined)
            {
                votesGrpByDate[k].receiverVotes=votesGrpByDate[k].votes.reduce((a,c)=>{
                    if( c.receiver===signerAddress){
                        a += c.up?1:-1;
                    }
                    return a;
                },0);
                votesGrpByDate[k].votesShare=votesGrpByDate[k].receiverVotes/votesGrpByDate[k].sumVotes;
            }
        });

        const last15Votes = votes.slice(-15);
        
        const maxUniqueContent = Math.max(Object.keys(votesGrpByDate).map((k)=>votesGrpByDate[k].uniqueContent));
        const maxUniqueSender = Math.max(Object.keys(votesGrpByDate).map((k)=>votesGrpByDate[k].uniqueSender));
        const maxUniqueReceiver = Math.max(Object.keys(votesGrpByDate).map((k)=>votesGrpByDate[k].uniqueReceiver));
        const maxUnique = Math.max(...[maxUniqueContent,maxUniqueSender,maxUniqueReceiver])
        Object.keys(votesGrpByDate).forEach((k)=>{
            votesGrpByDate[k].relUniqueContent=votesGrpByDate[k].uniqueContent/maxUnique;
            votesGrpByDate[k].relUniqueSender=votesGrpByDate[k].uniqueSender/maxUnique;
            votesGrpByDate[k].relUniqueReceiver=votesGrpByDate[k].uniqueReceiver/maxUnique;
        });
        updateOverallVotes(votesGrpByDate);
        updateUniqueContentReceiverSender(votesGrpByDate);
        updateRecentVotes(last15Votes);
    });

    asyncGetDonated().then((donated)=>{
        updateDonated(donated.slice(-20));
    });
}

function connect(){
    initiateContract().then(()=>{
        populate();
    });
}

import('./ethers.6.9.1.min.js').then((modules)=>{
    ethers=modules;
    directContract().then(()=>{
        populate();
    })
    
});


