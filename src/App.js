import React, { Component } from 'react'
import LocationList from './LocationList.js'

import './App.css'

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

class App extends Component {

  state = {
    locations: locations,
    modalIsOpen: false,
    modalTitle: '',
    modalImageUrl: '',
    popupIconUrl: ''
  }

  render() {
    return (
      <div className="App">
        <header className="header">Riga Bedtime Story Route<br/><i className="fa fa-bicycle" aria-hidden="true"></i></header>
        <LocationList locations={locations}/>
      </div>
    );
  }
}

export default App;
