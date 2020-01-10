// 'use strict';

const apiKey = '<your api token here>';
const searchURL = "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?";

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`);
    return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();

  for(let i = 0; i < responseJson.query.search.length; i++){
    $('#results-list').append(
      `
      <li><h3>${responseJson.query.search[i].title}</h3></li>
      <ul>
        <li>${responseJson.query.search[i].pageid}</li>
        <li>${responseJson.query.search[i].snippet}</li>
      </ul>
      `);}
  $('#results').removeClass('hidden');
}

function getBands(genre, maxResults=10) {
  const params = {
    "action": "query",
    "list": "search",
    srsearch: genre,
    "format": "json",
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

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const genre = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getBands(genre, maxResults);
  });
}

$(watchForm);
