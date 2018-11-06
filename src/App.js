import React, { Component } from 'react'
import './App.css'
import './Map.js'
import './LocationTable.js'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import * as api from './api.js'

import Modal from 'react-modal';
Modal.setAppElement('#root');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};//modal

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
//fix for default icon path; a workaround by @PTihomir from: https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-269750768

let locations = [
  {latlng: {lat: 56.983903, lng: 24.194472}, title: 'Rīgas Krusta baznīca' },
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
    locations: locations,
    modalIsOpen: false,
    modalTitle: '',
    modalImageUrl: '',
    popupIconUrl: ''
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
      let {latlng} = location;
      location.marker = L.marker(latlng, {
        icon:L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png',
          className: 'blinking'
        })
      }).addTo(map);

    location.marker.on('click', async e => {

      let location = locations.find(location => location.marker === e.target);

      if (location.marker.getPopup()){
        return;
      }
      let { title } = location;
      let {lat, lng} = location.latlng;

      let foursquareData = await api.fetchFoursquareData(lat, lng, title);

      location.marker.unbindPopup();
      location.marker.bindPopup(`
          <p>${title}</p>
          <img src="${foursquareData.iconUrl}" alt="${title}"/>
        `);

      location.marker.openPopup();
      });
    })
  }

  //blink animation from: https://stackoverflow.com/questions/41884070/how-to-make-markers-in-leaflet-blinking
  componentWillUnmount(){

  }

  async selectItem(e) {

    let location = locations.find(location => location.title === e.target.innerText);
    location.marker.openPopup();

    let { title } = location;
    let {lat, lng} = location.latlng;

    let foursquareData = await api.fetchFoursquareData(lat, lng, title);

    location.marker.unbindPopup();

    location.marker.bindPopup(`
      <p>${title}</p>
      <img src="${foursquareData.iconUrl}" alt="${title}"/>
    `);

    location.marker.openPopup();

    this.setState({
      modalTitle: title,
      modalImageUrl: foursquareData.imageUrl,
     });

    this.openModal();
  }

  search(e) {

    let found = locations.filter(location => {
      return RegExp(e.target.value, 'i').test(location.title);
    });

    this.setState({
      locations: found
    });
//hide markers
    locations.forEach(location => {

      location.marker.removeFrom(map);

      if (found.find(loc => loc.title === location.title)) {
        location.marker.addTo(map);
      }

    });
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {

    let list = this.state.locations.map(location => {
      return <div onClick={(e)=>{this.selectItem(e)}} className="list-item">{location.title}</div>;
    });

    return (
      <div className="App">

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={()=>this.closeModal()}
          style={customStyles}
          contentLabel="Info Modal">
            <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.modalTitle}</h2>
            <img src={this.state.modalImageUrl} alt={this.state.modalTitle}/>
            <button onClick={()=>this.closeModal()}>close</button>
        </Modal>

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
