import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    latitude: null,
    longitude: null,
    locationError: '',
    loadingLocation: false
  };

  componentWillMount() {
    this.getLocation();
  }

  getLocation = () => {
    if (navigator.geolocation) {
      this.setState({ loadingLocation: true });
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            loadingLocation: false,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {},
        this.handleLocationError
      );
    } else {
      this.setState({
        locationError: 'Geolocation is not supported by this browser.'
      });
    }
  };

  handleLocationError = error => {
    let locationError = '';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        error = 'User denied the request for Geolocation.';
        break;
      case error.POSITION_UNAVAILABLE:
        error = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        error = 'The request to get user location timed out.';
        break;
      case error.UNKNOWN_ERROR:
      default:
        error = 'An unknown error occurred.';
        break;
    }
    this.setState({ locationError, loadingLocation: false });
  };

  showSpinner = () => {
    let { loadingLocation } = this.state;
    if (!loadingLocation) return null;
    return (
      <div className="spinner">
        <div className="rect1" />
        <div className="rect2" />
        <div className="rect3" />
        <div className="rect4" />
        <div className="rect5" />
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        <div>{this.showSpinner()}</div>
      </div>
    );
  }
}

export default App;
