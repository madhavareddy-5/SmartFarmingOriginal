import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Thermometer, Droplets, Wind, Umbrella, CloudRain, AlertTriangle } from 'lucide-react';
import axios from 'axios';

// Replace with your actual API key
const WEATHER_API_KEY = '318b11db9cd27a1bbdd3e39640c06f23';

const Weather = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState('Vijayawada');
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData(location);
  }, []);

  const fetchWeatherData = async (query) => {
    setLoading(true);
    setError(null);

    try {
      // Use OpenWeatherMap Geocoding API
      const geoRes = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${WEATHER_API_KEY}`);
      if (!geoRes.data.length) throw new Error('Location not found');

      const { lat, lon, name } = geoRes.data[0];
      setLocation(name);

      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`)
      ]);

      setWeatherData(currentRes.data);
      setForecastData(forecastRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherData(searchQuery);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-4">{t('weather.title')}</h1>

      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('weather.searchLocation')}
          className="flex-1 p-2 border rounded-l"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
          {t('common.search')}
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : weatherData ? (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{location}</h2>
          <div className="flex items-center mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />
            <div className="ml-4">
              <p className="text-2xl">{Math.round(weatherData.main.temp)}°C</p>
              <p>{weatherData.weather[0].description}</p>
            </div>
          </div>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>

          {forecastData && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">{t('weather.forecast')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {forecastData.list.filter((_, i) => i % 8 === 0).map((item, index) => (
                  <div key={index} className="text-center p-2 border rounded">
                    <p className="font-medium">{index === 0 ? t('weather.today') : formatDate(item.dt)}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt="Icon"
                      className="mx-auto"
                    />
                    <p>{Math.round(item.main.temp)}°C</p>
                    <p>{item.weather[0].description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>{t('weather.enterLocation')}</p>
      )}
    </div>
  );
};

export default Weather;
