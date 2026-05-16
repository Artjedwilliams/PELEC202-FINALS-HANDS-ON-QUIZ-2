import React, { useState } from 'react';
import './App.css';

const API_KEY = "f4f7e307deca03176df65d848834043a";
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeatherClass = (temp) => {
    if (temp <= 20) return 'cold-weather';
    if (temp >= 31) return 'hot-weather';
    return 'normal-weather';
  };

  const fetchWeather = async (e) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('Please enter a city name...');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch(
        `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) throw new Error('Enter a valid city name.');
        if (response.status === 401) throw new Error('Invalid API key. Please contact the developer.');
        throw new Error('Failed to fetch weather data. Please try again later.');
      }

      const data = await response.json();
      setWeatherData({
        cityName: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].description,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🌤️ Weather App</h1>
      
      <form onSubmit={fetchWeather} className="form">
        <input
          type="text"
          placeholder="Search City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {loading && <p className="loading">Loading</p>}
      {error && <p className="error">⚠️ {error}</p>}
      
      {weatherData && (
        <div className={`weather-card ${getWeatherClass(weatherData.temperature)}`}>
          <h2>{weatherData.cityName}</h2>
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="condition">{weatherData.condition}</p>
        </div>
      )}
    </div>
  );
}

export default App;
