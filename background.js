// Listen for a message from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getImdbId") {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url && currentTab.url.includes('imdb.com/title/')) {
        const imdbIdRegex = /(tt\d{7,})/;
        const match = currentTab.url.match(imdbIdRegex);
        if (match && match[0]) {
          // If we found an ID, send it back to the popup
          sendResponse({ imdbId: match[0] });
        } else {
          sendResponse({ imdbId: null }); // No ID found
        }
      } else {
        sendResponse({ imdbId: null }); // Not an IMDb page
      }
    });
    // Required to indicate you will send a response asynchronously
    return true; 
  }
});