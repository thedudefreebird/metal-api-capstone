
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
  $('.results').empty();
  let pageKey = Object.keys(responseJson.query.pages)[0];

$('.results').append(
  `
    <h2>Search results</h2>
    <h3>Title: ${responseJson.query.pages[pageKey].title}</h3>
    <h3>Page ID: ${responseJson.query.pages[pageKey].pageid}</h3>
    <h3>Information:<br> ${responseJson.query.pages[pageKey].extract}</h3>
  `);
}

//Function to fetch info from URL
function getBands(band, maxResults=5) {
  const params = {
    "format": "json",
    "action": "query",
    "prop": "extracts&exintro&explaintext",
    "redirects": "1",
    "titles": band,
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
    const band = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getBands(band, maxResults);
  });

  $('.subList').on('click', '.subList-btn', function(event){
  		event.stopPropagation();
  		let band= $(this).val();
  		getBands(band);
  	});





  // $('.btn').on('click', event => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   console.log(this);
  //   $('.results').empty();
  //   const band = $(this).val();
  //   //const maxResults = $('#js-max-results').val();
  //   getBands(band);
  // });

}


$(watchForm);
