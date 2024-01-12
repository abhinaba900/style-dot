import React, { useEffect, useState } from "react";
import axios from "axios";
import Error from "../Error";
import "./CityNameSearch.css";
function CityNameSearch({ searchValue }) {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [unit, setUnit] = useState("celsius");

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobile]);

  const handleClick = () => {
    // Toggle between Celsius and Fahrenheit
    setUnit((prevUnit) => (prevUnit === "celsius" ? "fahrenheit" : "celsius"));
  };
  useEffect(() => {
    async function getWeather(city) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1b9f718d43b4721dd314069ebb6e4ebd&units=metric`;
        const response = await axios.get(url);
        setWeatherData(response.data);
        setError(false);
      } catch (error) {
        setError(true);
      }
    }

    if (searchValue) {
      getWeather(searchValue);
    }
  }, [searchValue]);

  const convertTemperature = (temperature) => {
    // Convert temperature based on the selected unit
    if (unit === "celsius") {
      return `${temperature}°C`;
    } else {
      // Convert Celsius to Fahrenheit
      const fahrenheit = (temperature * 9) / 5 + 32;
      return `${fahrenheit.toFixed(2)}°F`;
    }
  };

  if(error) {
    return <Error error={error} />
  }
  return (
    <>
      <h1 className="heading">Full Weather Report</h1>
      <div className="CityNameSearch">
        <div className="weather-info">
          {error && <Error error={error} />}
          {weatherData && (
            <div>
              <img
                style={{
                  width: 100,
                  height: 100,
                  margin: "auto",
                  display: "block",
                }}
                src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                alt="Weather Icon"
              />
              <h2>
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p onClick={handleClick}>
                Temperature: {convertTemperature(weatherData.main.temp)}
              </p>
              <p onClick={handleClick}>
                Min Temperature: {convertTemperature(weatherData.main.temp_min)}
              </p>
              <p onClick={handleClick}>
                Max Temperature: {convertTemperature(weatherData.main.temp_max)}
              </p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind Speed: {weatherData.wind.speed} m/s</p>
              <p>Wind Direction: {weatherData.wind.deg}°</p>
              <p>Description: {weatherData.weather[0].description}</p>
            </div>
          )}
        </div>
        <div id="map">
          <iframe
            className="google-maps"
            id="gmap_canvas"
            src={`https://maps.google.com/maps?q=${searchValue}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            frameBorder={0}
            scrolling="yes"
            marginHeight={0}
            marginWidth={0}
          />
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".mapouter{position:relative;text-align:right;height:auto;width:auto;}",
            }}
          />
          <a href="https://www.embedgooglemap.net" />
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".gmap_canvas {overflow:hidden;background:none!important;height:auto;width:auto;}",
            }}
          />
        </div>
      </div>
    </>
  );
}

export default CityNameSearch;
