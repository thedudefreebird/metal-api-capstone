// 'use strict';

const apiKey = '<your api token here>';
const searchURL = "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?";

//Function to create url for fetch
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`);
    return queryItems.join('&');
}

//Function to display what is given from fetch
function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();

  for(let i = 0; i < responseJson.query.pages.length; i++){
    $('#results-list').append(
      `
      <li><h3>${responseJson.query.pages[i].title}</h3></li>
      <ul>
        <li>${responseJson.query.pages[i].pageid}</li>
        <li>${responseJson.query.pages[i].extract}</li>
      </ul>
      `);}
  $('#results').removeClass('hidden');

//Postman path:
//query -> pages -> pageid(just in numerical form, not specifying pageid) -> pageid, ns, title, extract.
}

//Function to fetch info from URL
function getBands(genre, maxResults=5) {
  const params = {
    "format": "json",
    "action": "query",
    "prop": "extracts&exintro&explaintext",
    // "exintro": ``,//No = needed for param, with uncommented, below occurs
    // "explaintext": ``,//No = needed for param, with uncommented, below occurs
    "redirects": "1",
    "titles": genre,

    //prop=extracts&exintro&explaintext&redirects=1&titles=
    //
    //Above should be url to fetch from
    //
    //prop=extracts&exintro=&explaintext=&redirects=1&titles=
    //Above is current issue

    //Working params for search of just quick display from wiki:
    // "action": "query",
    // "list": "search",
    // srsearch: genre,
    // "format": "json",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      console.log(err);
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

//Watchform Function
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const genre = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getBands(genre, maxResults);
  });
}

$(watchForm);
