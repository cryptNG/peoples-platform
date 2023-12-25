//injects like and dislike buttons for peoplesplatform
function injectCSS(file, node) {
  const th = document.getElementsByTagName(node)[0];
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', file);
  th.appendChild(link);
}

function buildVoteInteractionButtonsHtml(){
  
      // Generate unique IDs for the buttons
      const buttonId = generateUniqueAlphanumericId();
 const  buttonIdLike = buttonId + "L";
 const  buttonIdDislike = buttonId + "D";
  return {html: `
<div class="replaceable">
  <button id="${buttonIdLike}" class="pce-ext-button like">&#x1F44D;</button> 
  <button id="${buttonIdDislike}" class="pce-ext-button dislike">&#x1F44E;</button>
  </div>
`, buttonIdLike: buttonIdLike, buttonIdDislike: buttonIdDislike}};


let receiver;
let videoUrl;
let title = "unknown";
let creatorHandle = "unknown";

function injectUiElements() {
  const extension = document.querySelector('#pce-ext-inject');
  if (extension) {
    return;
  }

  receiver = "";
  videoUrl = "";
  title = "unknown";
  creatorHandle = "unknown";


    //only inject ui if it does not exist
 

    //detect if a wallet is in the post
    const microformatJsonRaw = document.querySelector('#microformat script[type="application/ld+json"]').text

    // Parse the JSON string into an object
    const microFormatJsonData = JSON.parse(microformatJsonRaw);

    // Extract the 'description' value
    const description = microFormatJsonData.description;

    const peoplesNetworkWalletRegex = /#peoplesnetwork:0x[a-fA-F0-9]+/;

    // Search for the pattern in the description
    const peoplesNetworkWalletRaw = description.match(peoplesNetworkWalletRegex);
    let peoplesNetworkWalletSanitized = "0x0000000000000000000000000000000000000000"; //TODO: CG, default value has to be checked in contract!
    if (peoplesNetworkWalletRaw) {
      // Remove '#peoplesnetwork:' from the matched string
      peoplesNetworkWalletSanitized = peoplesNetworkWalletRaw[0].replace("#peoplesnetwork:", "");
      console.debug(peoplesNetworkWalletSanitized); // Outputs the wallet address without '#peoplesnetwork:'
    } else {
      console.debug('peoplesNetworkWalletRaw Pattern not found');
    }


    creatorHandle = document.querySelector('#container.style-scope.ytd-channel-name a').getAttribute('href');


    receiver = peoplesNetworkWalletSanitized;

    const targetDiv = document.querySelector('ytd-app ytd-page-manager ytd-watch-flexy ytd-watch-metadata ytd-menu-renderer div#top-level-buttons-computed');

    if (targetDiv) {
      const customDiv = document.createElement('div');
      customDiv.id = 'pce-ext-inject';
      customDiv.style.display = "flex";
      customDiv.style.flexDirection = "row";
      customDiv.style.marginRight = "2rem";




      // Combine the style tag and button HTML
      const builtHtmlAndButtonIds = buildVoteInteractionButtonsHtml();
      customDiv.innerHTML = builtHtmlAndButtonIds.html;

      videoUrl = window.location.href;

      const titleElement = document.querySelector("#title h1.style-scope.ytd-watch-metadata yt-formatted-string.style-scope.ytd-watch-metadata");

      
      if (titleElement) {
        title = titleElement.textContent.trim(); // This will retrieve the text content

      }




      targetDiv.prepend(customDiv);

      document.getElementById(builtHtmlAndButtonIds.buttonIdLike).addEventListener('click', () => {
        sendUpvoteToContentPageInteractions(receiver, videoUrl, title, creatorHandle);
        
      });
      document.getElementById(builtHtmlAndButtonIds.buttonIdDislike).addEventListener('click', () => {
        sendDownvoteToContentPageInteractions(receiver, videoUrl, title, creatorHandle);
      });
    }


}



function generateUniqueAlphanumericId() {
  const alphanumericCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) { // You can adjust the length of the ID as needed
    const randomIndex = Math.floor(Math.random() * alphanumericCharacters.length);
    id += alphanumericCharacters.charAt(randomIndex);
  }
  return id;
}

function injectScript(file, node, scriptId) {
  // Check if the script has already been injected
  if (document.getElementById(scriptId)) {
      console.log(`Script with ID ${scriptId} is already injected.`);
      return;
  }

  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  s.setAttribute('id', scriptId); // Set a unique ID for the script element
  th.appendChild(s);
}




function sendUpvoteToContentPageInteractions(receiver, url, title, handle) {
  displaySpinner();
  window.postMessage({ type: "PCE_UPVOTE_CONTENT", receiver: receiver, contentUrl: url, title: title, handle: handle }, "*");
}
function sendDownvoteToContentPageInteractions(receiver, url, title, handle) {
  displaySpinner();
  window.postMessage({ type: "PCE_DOWNVOTE_CONTENT", receiver: receiver, contentUrl: url, title: title, handle: handle }, "*");
}

// Listen for messages from the injected script
window.addEventListener('message', function(event) {
  // Ensure the message is from your injected script
  if (event.source === window && event.data.type && event.data.type == "PCE_VOTE_SUCCESS") {
      console.log("Message received from injected script:", event.data);
      hideSpinner();
      storeVoteUpdateUi(event.data.upvote);
  }
  if (event.source === window && event.data.type && event.data.type == "PCE_VOTE_ERROR") {
 
      hideSpinner();
  }
  
});

function storeVoteUpdateUi(upvote)
{
  storeVote(window.location.href,upvote);
  if (upvote === true) {
    document.querySelector('#pce-ext-inject .pce-ext-button.like').classList.add('voted');
  } else if (upvote === false) {
     document.querySelector('#pce-ext-inject .pce-ext-button.dislike').classList.add('voted');
  } 
}

function storeVote(key, value) {
  var obj = {};
  obj[key] = value; // Using bracket notation to set the dynamic key
  chrome.storage.local.set(obj, function() {
    // Optional: Add callback logic here if needed
  });
}


function retrieveVote(key, callback) {
  chrome.storage.local.get(key, function(result) {
    if(result[key] === undefined) {
        callback(null); // Use a callback to return the value
    } else {
        callback(result[key]); // Use a callback to return the value
    }
  });
}


function displaySpinner()
{
  var replaceable = document.querySelector('#pce-ext-inject div.replaceable');
  replaceable.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';

} 


function hideSpinner() {
  // Select the parent element, which is '#pce-ext-inject'
  var parentElement = document.querySelector('#pce-ext-inject');

  // Check if the parent element is found
  if (parentElement) {
      // Get the HTML content from buildVoteInteractionButtonsHtml
      const voteInteractionButtonsHtmlAndButtonIds = buildVoteInteractionButtonsHtml();

      // Overwrite the content of the parent element
      parentElement.innerHTML = voteInteractionButtonsHtmlAndButtonIds.html;

      document.getElementById(voteInteractionButtonsHtmlAndButtonIds.buttonIdLike).addEventListener('click', () => {
        sendUpvoteToContentPageInteractions(receiver, videoUrl, title, creatorHandle);
        
      });
      document.getElementById(voteInteractionButtonsHtmlAndButtonIds.buttonIdDislike).addEventListener('click', () => {
        sendDownvoteToContentPageInteractions(receiver, videoUrl, title, creatorHandle);
      });
  }

  
}



function checkVotedUpdateUi() {
  const vUrl =  window.location.href;
  retrieveVote(vUrl, function(vote){
    if (vote === true) {
      console.log('User already upvoted, marking!');
      document.querySelector('#pce-ext-inject .pce-ext-button.like').classList.add('voted');
  } else if (vote === false) {
      console.log('Vote for this URL is false');
      document.querySelector('#pce-ext-inject .pce-ext-button.dislike').classList.add('voted');
  } 

  });

  
}



// Function to check if the element is present and log to console
function initializeExtension() {
  console.log('INITIALIZE EXTENSION [INJECT] ');
  injectScript(chrome.runtime.getURL('lib/ethers.min-6.8.1.js'), 'body', 'ethersScript');
  injectScript(chrome.runtime.getURL('lib/inject_metamaskInteraction.js'), 'body', 'metamaskInteractionScript');
  injectScript(chrome.runtime.getURL('lib/inject_contentPageInteractions.js'), 'body', 'contentPageInteractionsScript');
  
}

function initializeUi()
{
  console.log('INITIALIZE EXTENSION [UI] ');
  const element = document.getElementById('top-level-buttons-computed'); //this is the computed info bar containing like (no more dislike) ratio
  if (element) {
  injectUiElements();
  checkVotedUpdateUi();
  //observer.disconnect();
  }
}





// // Create a new instance of MutationObserver and provide a callback function
// const observer = new MutationObserver(initializeUi);

// // Start observing the document body for changes in the child elements
// observer.observe(document.body, { childList: true, subtree: true });

// // Optional: Call checkAndLogElement initially in case the element is already there
// initializeExtension();

initializeExtension();


  //Listen for messages from the injected script to know if the page has been navigated etc.
  window.addEventListener('message', function(event) {
    if (event.source === window && event.data.type && event.data.type == "PCE_SITE_NAVIGATED") {
      initializeExtension();

    initializeUi();
    }
  });