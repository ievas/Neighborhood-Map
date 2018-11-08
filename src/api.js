import broken from './img/broken.png'
import broken_icon_size from './img/broken_icon_size.png'

async function fetchFoursquareData(lat, lng, query) {

  let imageUrl = broken;
  let iconUrl = broken_icon_size;
  let altText = '';

  try {

    let venueSearchUrl =

      `https://api.foursquare.com/v2/venues/search` +
      `?ll=${lat},${lng}` +
      `&query=${query}` +
      `&radius=250` +
      `&limit=1` +
      `&client_id=${process.env.REACT_APP_CLIENT_ID}` +
      `&client_secret=${process.env.REACT_APP_CLIENT_SECRET}` +
      `&v=20181104`;

    let venueSearchResult = await (await fetch(venueSearchUrl)).json();

    let venueId = venueSearchResult.response.venues[0].id;

    let venueDetailSearchUrl =

      `https://api.foursquare.com/v2/venues/${venueId}` +
      `?limit=1` +
      `&client_id=${process.env.REACT_APP_CLIENT_ID}` +
      `&client_secret=${process.env.REACT_APP_CLIENT_SECRET}` +
      `&v=20181104`;

    let venueDetailSearchResult = await (await fetch(venueDetailSearchUrl)).json();

    let bestPhoto = venueDetailSearchResult.response.venue.bestPhoto;

    if (bestPhoto) {
      let photoSize = '300x300';
      imageUrl = `${bestPhoto.prefix}${photoSize}${bestPhoto.suffix}`;
    }

    let category = venueDetailSearchResult.response.venue.categories[0];
    let iconSize = 88;
    iconUrl = `${category.icon.prefix}${iconSize}${category.icon.suffix}`;
  }
  catch (e) {
    altText = `Couldn't load image.`;
  }

  return {
    imageUrl,
    iconUrl,
    altText
  }
}

export { fetchFoursquareData };
