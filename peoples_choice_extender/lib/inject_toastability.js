
//TOAST SPECIFICS

const FADE_DUR = 700, MIN_DUR = 3000; // 2000
let toastContain, currentToast, hideTimeout, removeTimeout;

function toast(str, title,addDur, addClass) {
    let exDuration = 0;
    if(addDur)
    {
        exDuration = addDur;
    }
  let duration = Math.max(MIN_DUR + exDuration, str.length * 80);

  // Clear existing toast if present
  if (currentToast) {
    clearTimeout(hideTimeout);
    clearTimeout(removeTimeout);
    toastContain.removeChild(currentToast);
  }

  if (!toastContain) {
    toastContain = document.createElement('div');
    toastContain.classList.add('pce-toastContain');
    document.body.appendChild(toastContain);
  }

  const EL = document.createElement('div');
  EL.classList.add('pce-toast', addClass);
  EL.innerText = str;

  const etitle = document.createElement('div');
  etitle.classList.add('pce-toast-title');
  etitle.innerText = title;
  EL.prepend(etitle);

  toastContain.prepend(EL);
  currentToast = EL;

  setTimeout(() => EL.classList.add('open'));
  hideTimeout = setTimeout(() => EL.classList.remove('open'), duration);
  removeTimeout = setTimeout(() => {
    toastContain.removeChild(EL);
    if (EL === currentToast) {
      currentToast = null;
    }
  }, duration + FADE_DUR);
}



function getVoteButtonPressedMessage() {
  const randomIndex = Math.floor(Math.random() * voteConfirmationMessages.length);
  return voteConfirmationMessages[randomIndex];
}


const metamaskErrorCodes = [
  { code: 4001, message: "You rejected the request, no vote is being sent on your behalf." },
  { code: -32602, message: "An ERROR occured: Invalid parameters sent to the method." },
  { code: -32603, message: "An ERROR occured: Internal JSON-RPC error." },
  { code: 4100, message: "The requested account and/or method has not been authorized by You." },
  { code: 4200, message: "Your permission to access the requested method have been revoked." },
  { code: 4900, message: "MetaMask is locked or the you're not connected to the Extension!" },
  { code: 4901, message: "MetaMask is not initialized or the you're not connected to the Extension!" }
];

const voteConfirmationMessages = [
  'Thanks for Voting! A wild MetaMask popup appears!',
  'Your vote is super important! Please give MetaMask a nudge to confirm it!',
  'Hooray! Now, just a quick hop over to MetaMask to make it official!',
  'You clicked! Now let MetaMask know you really mean it!',
  `Your vote's almost there! MetaMask is eagerly waiting for your confirmation!`,
  'Great choice! Let MetaMask know you’re sure about it!',
  'Awesome! Now just one more click in MetaMask to seal the deal!',
  `You're almost done! MetaMask is just a click away for your confirmation!`,
  'Your vote counts! Please confirm it in MetaMask, and make it count double!',
  'Thanks for making a choice! MetaMask is ready to confirm your splendid decision!'
];

const metamaskConnectMessages = [
  'Join the revolution for a censorship-free web! Please open MetaMask to connect to GNOSIS.',
  'Your voice matters in shaping an open internet. Open MetaMask to connect with GNOSIS!',
  'Be a part of internet history! Connect to GNOSIS through MetaMask now.',
  `Together, we're building a freer internet. Start by connecting to GNOSIS via MetaMask!`,
  'Take a stand for digital freedom! Open MetaMask and connect to GNOSIS.',
  'Help us forge a path to a censorship-free web. Connect to GNOSIS through MetaMask!',
  'Your support is crucial for a free internet. Please use MetaMask to connect to GNOSIS.',
  'Thank you for being an internet freedom fighter! Connect to GNOSIS via MetaMask now.',
  'Every connection counts towards a better web. Open MetaMask and join GNOSIS!',
  `You're one step away from making a difference. Connect to GNOSIS with MetaMask!`
];
const metamaskNotInstalledMessages = [
  'Hey! To join our journey towards a free internet, you need MetaMask. Sadly, it seems you don’t have it installed.',
  'Oops! Looks like you don’t have MetaMask. Install it to help us build a better, censorship-free internet.',
  'We appreciate your eagerness to contribute! However, MetaMask is required to use this extension.',
  `Your enthusiasm is awesome! But you'll need MetaMask to make a difference with us.`,
  `Want to be a part of our cause? You'll need MetaMask, which isn't installed on your system yet.`,
  'Your support is vital for a free internet. To get started, please install MetaMask.',
  `To help us in building a censorship-free web, MetaMask is the key. It seems you don't have it yet.`,
  'Thank you for your interest in our cause! Please install MetaMask to proceed.',
  'Your journey towards internet freedom awaits! But first, MetaMask needs to be installed.',
  'Eager to contribute? Let’s get you started with MetaMask, which you currently don’t have.'
];
const voteTransactionSuccessMessages = [
  'Thanks for voting! Your voice makes a difference!',
  'Your vote counts! Thank you for making your mark!',
  'Hooray! Your vote has been successfully cast!',
  'Thank you for voting! Every vote brings change!',
  `Your vote is in! You're shaping the future!`,
  'Awesome! Your vote has been recorded!',
  'Your opinion matters – thanks for voting!',
  'Your vote is a step towards progress! Thank you!',
  'Great job! Your vote has been successfully registered!',
  'Thank you for participating! Your vote counts!'
];

function getVoteTransactionSuccessMessage() {
  const randomIndex = Math.floor(Math.random() * voteTransactionSuccessMessages.length);
  return voteTransactionSuccessMessages[randomIndex];
}

function getMetaMaskErrorMessage(errorCode) {
  const error = metamaskErrorCodes.find(error => error.code === errorCode);
  return error ? error.message : `Unknown error occurred. Please check the error code: [${errorCode}]`;
}

function getMetamaskConnectMetamaskMessage() {
  const randomIndex = Math.floor(Math.random() * metamaskConnectMessages.length);
  return metamaskConnectMessages[randomIndex];
}


function getMetamaskNotInstalledMessage() {
  const randomIndex = Math.floor(Math.random() * metamaskNotInstalledMessages.length);
  return metamaskNotInstalledMessages[randomIndex];
}
