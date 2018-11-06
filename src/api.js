
async function fetchFoursquareData(lat, lng, query) {


  let venueSearchUrl =

    `https://api.foursquare.com/v2/venues/search` +
    `?ll=${lat},${lng}` +
    `&query=${query}` +
    `&radius=250` +
    `&limit=1` +
    `&client_id=${process.env.REACT_APP_CLIENT_ID}` +
    `&client_secret=${process.env.REACT_APP_CLIENT_SECRET}` +
    `&v=20181104`;

  // return image

  let venueSearchResult = await (await fetch(venueSearchUrl)).json();

  let venueId = venueSearchResult.response.venues[0].id;

  let venueDetailSearchUrl =

    `https://api.foursquare.com/v2/venues/${venueId}` +
    `?limit=1` +
    `&client_id=${process.env.REACT_APP_CLIENT_ID}` +
    `&client_secret=${process.env.REACT_APP_CLIENT_SECRET}` +
    `&v=20181104`;


  let venueDetailSearchResult = await (await fetch(venueDetailSearchUrl)).json();

  let imageUrl;
  let bestPhoto = venueDetailSearchResult.response.venue.bestPhoto;

  if (bestPhoto) {
    let photoSize = '300x300';
    imageUrl = `${bestPhoto.prefix}${photoSize}${bestPhoto.suffix}`;
  } else {
    imageUrl = `https://ss3.4sqi.net/img/categories_v2/arts_entertainment/museum_history_512.png`;
  }

  let category = venueDetailSearchResult.response.venue.categories[0];
  let iconSize = 88;
  let iconUrl = `${category.icon.prefix}${iconSize}${category.icon.suffix}`;

  return {
    imageUrl,
    iconUrl
  }
}

export { fetchFoursquareData };
