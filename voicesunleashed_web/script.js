import {BrowserProvider,Contract} from './ethers.6.9.1.min.js';


let contractAddress;
  

let provider ;
let signer ;
let contract ;

async function initiateContract()
{
    
    provider = new BrowserProvider(window.ethereum);
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

    contract = new Contract(contractAddress, contractABI, signer);
}

window.ethereum = window.ethereum || {};


function getCurrentChainNameAndId()
{ 
    initiateContract().then(()=>{
        provider.getNetwork().then((network)=>{
            const chainId =Number(network.chainId);
            const chainName = network.name;

            console.log( { chainId, chainName });
            document.querySelector('#donating .donation-card')?.classList.toggle('connected');
            document.querySelector('#donating .connect-wallet button').disabled = true;
        });
        
    });
    
}

function calculateDonationSum() {
    var months = document.querySelector('#duration-options').value;
    var monthlyAmount = document.querySelector('#donateAmountPerMonth').value;

    // Calculate the total donation sum
    var totalDonation = months * monthlyAmount;

    // Round to two decimal places and convert back to a number
    totalDonation = Number(totalDonation.toFixed(3));

    // Display the result in the calculatedSumDonation field
    return totalDonation;
}

function calculateAndDisplayDonationSum() {

    // Display the result in the calculatedSumDonation field
    document.querySelector('#calculatedSumDonation').value = calculateDonationSum();
}

function callDonate(){
    document.querySelector('#donating .donation-card')?.classList.toggle('donating');
    const months = document.querySelector('#duration-options').value;
    const name = document.querySelector('#donatorName').value;
    const oneFinneyInWey = 1000000000000000n;
    const valueInWey = BigInt(Math.trunc(Math.round(calculateDonationSum()*1000))) * oneFinneyInWey;
    asyncCallDonate(months,name,valueInWey).then(()=>{
        console.log("Successfully donated:"+valueInWey.toString());
    })
}

async function asyncCallDonate(months,name,valueInWey){
    try {
        const currentDate = new Date();
        const transaction = await contract.donate(months,name,{value:valueInWey});
        console.log('Vote transaction sent:', transaction.hash);
        await transaction.wait();
        console.log('Vote transaction confirmed');
        document.querySelector('#donating .donation-card')?.classList.toggle('donated');
    } catch (error) {
        if(error.toString().includes('missing v')){

        }else{
            
        }
        console.error('Vote transaction failed:', error);
        document.querySelector('#donating .donation-card')?.classList.toggle('donating');
    }
}



window.asyncCallDonate=asyncCallDonate;
window.callDonate=callDonate;
window.calculateAndDisplayDonationSum=calculateAndDisplayDonationSum;
window.calculateDonationSum=calculateDonationSum;
window.getCurrentChainNameAndId=getCurrentChainNameAndId;
window.initiateContract=initiateContract;