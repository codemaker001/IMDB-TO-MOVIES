document.addEventListener('DOMContentLoaded', () => {
  const movieBtn = document.getElementById('movie-btn');
  const showBtn = document.getElementById('show-btn');
  const seasonInput = document.getElementById('season');
  const episodeInput = document.getElementById('episode');
  const statusDiv = document.getElementById('status');
  const contentDiv = document.getElementById('content');

  // Request the IMDb ID from the background script as soon as the popup opens
  chrome.runtime.sendMessage({ action: "getImdbId" }, (response) => {
    if (response && response.imdbId) {
      const imdbId = response.imdbId;
      contentDiv.style.display = 'block'; // Show the buttons and inputs

      // --- Movie Redirect Button ---
     movieBtn.addEventListener('click', () => {
        const movieUrl = `https://111movies.com/movie/${imdbId}`;
        //chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         // chrome.tabs.update(tabs[0].id, { url: movieUrl });
         chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
            const currentTab =tabs[0];
            if(currentTab){
                chrome.tabs.create({url: movieUrl,index:currentTab.index +1});
            }
            else{
                chrome.tabs.create({url: movieUrl});
            }
         });
         
         
          window.close(); // Close the popup
        
      });

      // --- Show Redirect Button ---
      showBtn.addEventListener('click', () => {
        const season = seasonInput.value;
        const episode = episodeInput.value;
        if (season && episode) {
          const showUrl = `https://111movies.com/tv/${imdbId}/${season}/${episode}`;
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.update(tabs[0].id, { url: showUrl });

            window.close(); // Close the popup
          });
        }
      });

    } else {
      // If no IMDb ID was found, show an error message
      statusDiv.textContent = 'Error: Not on a valid IMDb title page.';
    }
  });
});