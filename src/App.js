import React, { Component } from 'react'
import './App.css'
import './Map.js'
import './LocationTable.js'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
//fix for default icon path; a workaround by @PTihomir from: https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-269750768

let locations = [
  {latlng: {lat: 56.983903, lng: 24.194472}, title: 'Krusta baznīca' },
  {latlng: {lat: 56.978575, lng: 24.186175}, title: 'Zemitāna laukums'},
  {latlng: {lat: 56.974512, lng: 24.165999}, title: 'VEF kultūras pils'},//vef
  {latlng: {lat: 56.970647, lng: 24.157338}, title: 'Gaisa tilts'},//gaisa tilts
  {latlng: {lat: 56.95979, lng: 24.126173}, title: 'Dailes teātris'}, //dailes teātris
  {latlng: {lat: 56.953298, lng: 24.105078}, title: 'Latvijas Nacionālais teātris'},//nacionālais teātris
  {latlng: {lat: 56.951652, lng: 24.098093}, title: 'Vanšu tilts'},//vanšu tilts
  {latlng: {lat: 56.948963, lng: 24.089456}, title: 'Saules akmens'}//saules akmens
];

let map;

class App extends Component {

  state = {
    locations: locations
  }

  componentDidMount() {

    map = L.map('mapid').setView([56.970647, 24.157338], 11.5);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiamV2YSIsImEiOiJjamx0djlxZWMwZTBhM3FvaXA2a3JteDN5In0.T6cHWQyXjXsDhwBVTemdYw'
    }).addTo(map);

    locations.forEach(location => {
      let {latlng, title} = location;
      location.marker = L.marker(latlng, {
        icon:L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png',
          className: 'blinking'
        })
      }).addTo(map).bindPopup(title)
    })
  }
  //blink animation from: https://stackoverflow.com/questions/41884070/how-to-make-markers-in-leaflet-blinking
  componentWillUnmount(){

  }

  selectItem(e) {

    let location = locations.find(location => location.title === e.target.innerText);
    location.marker.openPopup();
  }

  search(e) {

    let found = locations.filter(location => {
      return RegExp(e.target.value, 'i').test(location.title);
    });

    this.setState({
      locations: found
    });

    locations.forEach(location => {

      location.marker.removeFrom(map);

      if (found.find(loc => loc.title === location.title)) {
        location.marker.addTo(map);
      }

    });
  }

  render() {

    let list = this.state.locations.map(location => {
      return <div onClick={this.selectItem} className="list-item">{location.title}</div>;
    });

    return (
      <div className="App">
        <header className="header">Riga Bedtime Story Route</header>
        <div className="content">
          <div className="location-container">
            <div className="input-wrapper">
              <input onChange={e => this.search(e)}
              className="list-item"
              type="text"
              placeholder="Search"
              //value={this.state.query}
              //onChange = {(event) => this.updateQuery(event.target.value)}
              />
            </div>
            <div className="location-list">{list}</div>
          </div>
          <div className="map-container">
            <div id="mapid"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
