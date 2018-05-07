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
    weatherInfo: null,
    temperatureMeasure: 'C'
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

  showWeatherIcon = () => {
    let { weatherInfo } = this.state;
    let type = weatherInfo.weather[0].main.toLowerCase();
    let icon = null;
    switch (type) {
      case 'clear':
        icon = (
          <div className="icon sunny">
            <div className="sun">
              <div className="rays" />
            </div>
          </div>
        );
        break;
      case 'clouds':
        icon = (
          <div className="icon cloudy">
            <div className="cloud" />
            <div className="cloud" />
          </div>
        );
        break;
      case 'snow':
        icon = (
          <div className="icon flurries">
            <div className="cloud" />
            <div className="snow">
              <div className="flake" />
              <div className="flake" />
            </div>
          </div>
        );
        break;
      case 'rain':
        icon = (
          <div className="icon rainy">
            <div className="cloud" />
            <div className="rain" />
          </div>
        );
        break;
      case 'thunderstorm':
        icon = (
          <div className="icon thunder-storm">
            <div className="cloud" />
            <div className="lightning">
              <div className="bolt" />
              <div className="bolt" />
            </div>
          </div>
        );
        break;
      default:
        icon = (
          <div className="icon sun-shower">
            <div className="cloud" />
            <div className="sun">
              <div className="rays" />
            </div>
            <div className="rain" />
          </div>
        );
    }
    return icon;
  };

  showTemperature = () => {
    let { weatherInfo, temperatureMeasure } = this.state;
    if (!weatherInfo) return 0;
    let temp = weatherInfo.main.temp;
    if (temperatureMeasure === 'F') {
      let f = 9 / 5 * temp + 32;
      if (f.toString().includes('.')) return f.toFixed(2);
      return f;
    }
    if (temp.toString().includes('.')) return temp.toFixed(2);
    return temp;
  };

  toggleMeasure = measure => {
    this.setState({
      temperatureMeasure: measure
    });
  };

  showWeatherInfo = () => {
    let { weatherInfo, temperatureMeasure } = this.state;
    if (!weatherInfo) return null;
    let buttonsContainer =
      temperatureMeasure === 'F'
        ? 'temp-buttons-container reverse'
        : 'temp-buttons-container';
    return (
      <div className="weather-container">
        <div className="icon-container">{this.showWeatherIcon()}</div>
        <div className="temperature-container">
          <p className="temperature-text">{this.showTemperature()}</p>
          <div className={buttonsContainer}>
            <button
              className={temperatureMeasure === 'C' ? 'selected' : ''}
              onClick={() => this.toggleMeasure('C')}
            >
              C
            </button>
            <button
              className={temperatureMeasure === 'F' ? 'selected' : ''}
              onClick={() => this.toggleMeasure('F')}
            >
              F
            </button>
          </div>
        </div>
        <p className="weather-text">{`${weatherInfo.name}, ${
          weatherInfo.sys.country
        }`}</p>
        <p className="weather-text">{weatherInfo.weather[0].main}</p>
        <div className="weather-detail">
          <div className="single-detail">
            <p className="detail-number">{weatherInfo.wind.speed}</p>
            <p>km/h</p>
            <p className="detail-text">Wind</p>
          </div>
          <hr />
          <div className="single-detail">
            <p className="detail-number">{weatherInfo.main.humidity}</p>
            <p>%</p>
            <p className="detail-text">Humidity</p>
          </div>
          <hr />
          <div className="single-detail">
            <p className="detail-number">{weatherInfo.main.pressure}</p>
            <p>hPa</p>
            <p className="detail-text">Pressure</p>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        {this.showSpinner()}
        {this.showError()}
        {this.showWeatherInfo()}
      </div>
    );
  }
}

export default App;
