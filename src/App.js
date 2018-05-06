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
    this.setState({
      latitude: 2,
      longitude: 2
    });
    this.getWeatherInfo();
    return;
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
    return {
      coord: {
        lon: -0.13,
        lat: 51.51
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon:
            'https://cdn.glitch.com/6e8889e5-7a72-48f0-a061-863548450de5%2F01d.png?1499366022009'
        }
      ],
      base: 'stations',
      main: {
        temp: 19.45,
        pressure: 1023,
        humidity: 43,
        temp_min: 17,
        temp_max: 21
      },
      visibility: 10000,
      wind: {
        speed: 3.6,
        deg: 70
      },
      clouds: {
        all: 0
      },
      dt: 1525600200,
      sys: {
        type: 1,
        id: 5168,
        message: 0.0061,
        country: 'GB',
        sunrise: 1525580567,
        sunset: 1525635149
      },
      id: 2643743,
      name: 'London',
      cod: 200
    };
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
    // if (longitude === null || latitude === null) return;
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
    return (
      <div className="icon sun-shower">
        <div className="cloud" />
        <div className="sun">
          <div className="rays" />
        </div>
        <div className="rain" />
      </div>
    );
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
        <p className="weather-text">{weatherInfo.name}</p>
        <p className="weather-text">SUNNY</p>
        <div className="weather-detail">
          <div className="single-detail">
            <p className="detail-number">{weatherInfo.wind.speed}</p>
            <p>Icon</p>
            <p className="detail-text">Wind</p>
          </div>
          <hr />
          <div className="single-detail">
            <p className="detail-number">{weatherInfo.main.humidity}</p>
            <p>Icon</p>
            <p className="detail-text">Humidity</p>
          </div>
          <hr />
          <div className="single-detail">
            <p className="detail-number">{weatherInfo.main.pressure}</p>
            <p>Icon</p>
            <p className="detail-text">Pressure</p>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        {/* {this.showSpinner()}
        {this.showError()} */}
        {this.showWeatherInfo()}
      </div>
    );
  }
}

export default App;
