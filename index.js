
const searchURLWiki = "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?";
const apiKeyYouTube = ${{secrets.apiKeyYoutube}};
const searchURLYouTube = "https://www.googleapis.com/youtube/v3/search?";

//Function to create url for fetch
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`);
    return queryItems.join('&');
}

//Function to display what is given from fetch from Wikipedia
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

//Function to display what is given from fetch from Youtube
function displayResultsYoutube(responseJson) {
  console.log(responseJson);
  $('.resultsVids').empty();
  $('.resultsVids').append(`<h2>Video Search Results </h2>`)
  for(let i = 0; i < responseJson.items.length; i++){
    $('.resultsVids').append(
      `
        <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"<h3>${responseJson.items[i].snippet.title}</h3></a>
        <h5>${responseJson.items[i].snippet.channelTitle}<h5>
        <img src="${responseJson.items[i].snippet.thumbnails.medium.url}">
        <h5>${responseJson.items[i].snippet.description}<h5>
      `);}
    $('.resultsVids').removeClass('hidden');

}

//Function to fetch info from Wiki URL for searching a band
function getBands(band, maxResults=10) {
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

//Function to fetch info from Wiki URL for button selection
function getGenre(band, maxResults=10) {
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

//Function to fetch info from Youtube URL for searching a band
function getVideos(genre, maxResults=10) {
  const params = {
    "part": "snippet",
    "maxResults": maxResults,
    "order": "relevance",
    "q": genre,
    "type": "video",
    "key": apiKeyYouTube,

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

//Function to fetch info from Youtube URL for selecting a button
function getGenreVideos(genre, maxResults=10) {
  const params = {
    "part": "snippet",
    "maxResults": maxResults,
    "order": "relevance",
    "q": genre + '%20playlist',
    "type": "video",
    "key": apiKeyYouTube,
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

//Watchform Function, watching for what the user is going to do
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
  		getGenre(band);
      getGenreVideos(band, maxResults=10);
  	});

}


$(watchForm);
