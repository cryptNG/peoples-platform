

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


function sendVoteSuccessToExtension(upvote) {
  window.postMessage({ type: "PCE_VOTE_SUCCESS", upvote: upvote }, "*");
}

function sendVoteErrorToExtension() {
  window.postMessage({ type: "PCE_VOTE_ERROR" }, "*");
}

//todo replacing the ui elements breaks the listeners!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//youtube search - open video does not show extension, old implementation

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
    const byteEncodedHandle = ethers.toUtf8Bytes('youtube.com/' + handle);
    const interim = ethers.keccak256(byteEncodedHandle);  
    console.log('INTERIM: ' + interim);
    const magicBits = BigInt(0xf000000000000000000000000000000000000000);
    console.log('receiver: ' + receiver);
    receiver = (BigInt(interim)  >> 96n) | magicBits
    receiver = "0x"+receiver.toString(16);
  }

  try {
    transaction = await contract.vote(url, upvote, receiver, title);
      console.log('Vote transaction sent:', transaction.hash);
      await transaction.wait();
    
      console.log('Vote transaction confirmed');
      sendVoteSuccessToExtension(upvote);
      toast(getVoteTransactionSuccessMessage(),"People's Choice Extender");
  } catch (error) {
      console.error('Vote transaction failed:', error);
      sendVoteErrorToExtension();
      let message = error.shortMessage;
      if(error.info.error.code)
      {
        message = getMetaMaskErrorMessage(error.info.error.code);
      }
      toast(message,"People's Choice Extender");
  }
}
