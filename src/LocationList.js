import * as api from './api.js';
import React from 'react'
import Modal from 'react-modal';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl;

// fix for default icon path; a workaround by @PTihomir
// from: https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-269750768
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Modal.setAppElement('#root');

const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}; // modal styles

class LocationList extends React.Component {

  map

  state = {
    locations: this.props.locations,
    modalIsOpen: false,
    modalTitle: '',
    modalImageUrl: ''
  }

  componentDidMount() {

    // initialize map
    this.map = L.map('mapid').setView([56.970647, 24.157338], 11.5);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiamV2YSIsImEiOiJjamx0djlxZWMwZTBhM3FvaXA2a3JteDN5In0.T6cHWQyXjXsDhwBVTemdYw'
    }).addTo(this.map);

    // add makers to locations, set click handler
    this.props.locations.forEach(location => {
      let {latlng} = location;
      location.marker = L.marker(latlng).addTo(this.map);

      location.marker.on('click', async e => {

        let location = this.props.locations.find(location => location.marker === e.target);

        // if already initialized, don't fetch data
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

  // when list item is clicked
  async selectItem(e) {

    let location = this.props.locations.find(location => location.title.toLowerCase() === e.target.innerText.toLowerCase());

    // animate marker after selecting from list
    location.marker.setIcon(L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png',
      className: 'blinking'
    }));

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

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  search(e) {

    let found = this.props.locations.filter(location => {
      return RegExp(e.target.value, 'i').test(location.title);
    });

    this.setState({
      locations: found
    });

    // hide markers
    this.props.locations.forEach(location => {

      location.marker.removeFrom(this.map);

      if (found.find(loc => loc.title.toLowerCase() === location.title.toLowerCase())) {
        location.marker.addTo(this.map);
      }

    });
  }

  render() {

    let list = this.state.locations.map(location => {
      return <div key={location.title} onClick={(e)=>{this.selectItem(e)}} className="list-item">{location.title}</div>;
    });

    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={()=>this.closeModal()}
          style={customStyles}
          contentLabel="Info Modal">
            <div className="modal-content-wrapper">
             <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.modalTitle}</h2>
             <button onClick={()=>this.closeModal()} href="#close" className="close-button">x</button>
             <img src={this.state.modalImageUrl} alt={this.state.modalTitle}/>
            </div>
        </Modal>
        <div className="content">
          <div className="location-container">
            <div className="input-wrapper">
              <input onChange={e => this.search(e)}
              className="list-item"
              type="text"
              placeholder="Search"
              />
            </div>
            <div className="location-list">{list}</div>
          </div>
          <div className="map-container">
            <div id="mapid"></div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LocationList;
