
const searchURLWiki = "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?";
const apiKey = '<Your API Here';
const searchURLYouTube = "https://www.googleapis.com/youtube/v3/search?";

//Function to create url for fetch
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`);
    return queryItems.join('&');
}

//Function to display what is given from fetch
function displayResultsWiki(responseJson) {
  console.log(responseJson);
  $('.results').empty();
  let pageKey = Object.keys(responseJson.query.pages)[0];

  $('.results').append(
    `
      <h2>Search Results</h2>
      <h3>Title: ${responseJson.query.pages[pageKey].title}</h3>
      <p>Information:<br><br> ${responseJson.query.pages[pageKey].extract}</p>
      <h4>Page ID: ${responseJson.query.pages[pageKey].pageid}</h4>
      `);

  $('.results').removeClass('hidden');

}

function displayResultsYoutube(responseJson) {
  console.log(responseJson);
  $('.resultsVids').empty();
  for(let i = 0; i < responseJson.items.length; i++){
    $('.resultsVids').append(
      `
        <h2>Search Results for Videos</h2>
        <h3>${responseJson.items[i].snippet.title}</h3>
        <h5>${responseJson.items[i].snippet.channelTitle}<h5>
        <h5>${responseJson.items[i].snippet.description}<h5>
        <img src="${responseJson.items[i].snippet.thumbnails.default.url}">

      `);}
    $('.resultsVids').removeClass('hidden');

}

//Function to fetch info from Wiki URL
function getBands(band, maxResults=5) {
  const params = {
    "format": "json",
    "action": "query",
    "prop": "extracts&exintro&explaintext",
    "redirects": "1",
    "titles": band,
  };
  const queryString = formatQueryParams(params)
  const url = searchURLWiki + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResultsWiki(responseJson, maxResults))
    .catch(err => {
      console.log(err);
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}

//Function to fetch info from Youtube URL
function getVideos(genre, maxResults=5) {
  const params = {
    "q": genre + 'playlist',
    "key": apiKey,
    "part": "snippet"
  };
  const queryString = formatQueryParams(params)
  const url = searchURLYouTube + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResultsYoutube(responseJson, maxResults))
    .catch(err => {
      console.log(err);
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

//Watchform Function
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const band = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getBands(band, maxResults);
    getVideos(band, maxResults);
  });

  $('.subList').on('click', '.subList-btn', function(event){
  		event.stopPropagation();
  		let band= $(this).val();
  		getBands(band);
      getVideos(band, maxResults=5);
  	});

}


$(watchForm);
