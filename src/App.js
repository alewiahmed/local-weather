import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    errorType: '',
    loading: false,
    latitude: null,
    longitude: null,
    loadingInfo: '',
    loadingError: '',
    weatherInfo: null
  };

  componentWillMount() {
    this.getLocation();
  }

  clearError = () => {
    this.setState({
      errorType: '',
      loadingError: ''
    });
  };

  getLocation = () => {
    if (navigator.geolocation) {
      this.setState({
        loading: true,
        loadingInfo: 'getting location'
      });
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            loadingInfo: '',
            loading: false,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          this.getWeatherInfo();
        },
        this.handleLocationError,
        { timeout: 20000 }
      );
    } else {
      this.setState({
        errorType: 'location',
        loadingError: 'Geolocation is not supported by this browser.'
      });
    }
  };

  fetch = async (latitude, longitude) => {
    const URL = `https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`;
    try {
      const fetchResult = fetch(URL);
      const response = await fetchResult;
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Something went wrong.');
      }
    } catch (e) {
      return { error: e };
    }
  };

  getWeatherInfo = async () => {
    let { longitude, latitude } = this.state;
    if (longitude === null || latitude === null) return;
    this.setState({
      loading: true,
      loadingInfo: 'getting weather info...'
    });
    let result = await this.fetch(latitude, longitude);
    if (result.error) {
      this.setState({
        errorType: 'weather',
        loadingError: 'Something went wrong when getting weather info.'
      });
      return;
    } else {
      this.setState({
        loading: false,
        loadingInfo: '',
        weatherInfo: result
      });
    }
  };

  handleLocationError = error => {
    let loadingError = '';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        loadingError = 'User denied the request for Geolocation.';
        break;
      case error.POSITION_UNAVAILABLE:
        loadingError = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        loadingError = 'The request to get user location timed out.';
        break;
      case error.UNKNOWN_ERROR:
      default:
        loadingError = 'An unknown error occurred.';
        break;
    }
    this.setState({ loadingError, loading: false, errorType: 'location' });
  };

  showError = () => {
    let { loadingError, errorType } = this.state;
    if (loadingError === '') return null;
    let retryFunction =
      errorType === 'location' ? this.getLocation : this.getWeatherInfo;
    return (
      <div className="error-container">
        <p>{loadingError}</p>
        <button
          className="error-button"
          onClick={() => {
            this.clearError();
            retryFunction();
          }}
        >
          Retry
        </button>
      </div>
    );
  };

  showSpinner = () => {
    let { loading, loadingInfo } = this.state;
    if (!loading) return null;
    return (
      <div className="loading-container">
        <div className="spinner">
          <div className="rect1" />
          <div className="rect2" />
          <div className="rect3" />
          <div className="rect4" />
          <div className="rect5" />
        </div>
        <p>{loadingInfo}</p>
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        {this.showSpinner()}
        {this.showError()}
      </div>
    );
  }
}

export default App;
