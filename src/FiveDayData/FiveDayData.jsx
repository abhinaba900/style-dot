import React, { useEffect, useState } from "react";
import axios from "axios";
import Error from "../Error";
import "../App.css";
function FiveDayData({ searchValue }) {
  const [weatherData, setWeatherData] = useState([]);
  const [unit, setUnit] = useState("celsius");
  const [error, setError] = useState(null);
  useEffect(() => {
    async function getWeather(searchValue) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=1b9f718d43b4721dd314069ebb6e4ebd&units=metric`;
        const response = await axios.get(url);
        
        if (response.status === 200) {
          setError(false);
          const decodedData = decodeAndExtractData(response.data);
          setWeatherData(decodedData);
        } else {
          console.error(`Error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        setError(true);
      }
    }
    getWeather(searchValue);
  }, [searchValue]);
  const decodeAndExtractData = (weatherData) => {
    const groupedByDay = {};

    // Group data by day
    weatherData.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!groupedByDay[date] && Object.keys(groupedByDay).length < 6) {
        if (!groupedByDay[date]) {
          groupedByDay[date] = {
            dates: [],
            temperatures: [],
            descriptions: [],
            icons: [],
          };
        }

        groupedByDay[date].dates.push(entry.dt_txt);
        groupedByDay[date].temperatures.push(entry.main.temp);
        groupedByDay[date].descriptions.push(entry.weather[0].description);
        groupedByDay[date].icons.push(entry.weather[0].icon);
      }
    });

    // Extracted data for each day
    const decodedData = Object.entries(groupedByDay).map(([date, data]) => ({
      date: date,
      averageTemperature:
        data.temperatures.reduce((sum, temp) => sum + temp, 0) /
        data.temperatures.length,
      description: data.descriptions[0], // Taking the description of the first entry of the day
      icon: data.icons[0], // Taking the icon code of the first entry of the day
    }));

    return decodedData;
  };
  const [mobile, setMobile] = useState(false);


  
  const handleClick = () => {
    //View these details in both Celsius and Fahrenheit. Include an option for the user to toggle between these units.
    setUnit((prevUnit) => (prevUnit === "celsius" ? "fahrenheit" : "celsius"));
  };
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
  if (error) {
    return <Error />;
  }
  return (
    <div className="fivedayforcast">
      <h1 className="heading">Five Day Data</h1>
      <h3 className="location">Location:- {searchValue}</h3>

      <div className="weather-container-mobile">
        <div className="weather">
          {weatherData.map((data) => (
            <div>
              <img
                alt={data.description}
                style={{
                  width: 100,
                  height: 100,
                  margin: mobile && "auto",
                  display: mobile && "block",
                }}
                src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              />
              <p>{data.date}</p>
              <p onClick={handleClick}>
                {convertTemperature(data.averageTemperature)}
              </p>
              <p>{data.description}</p>
            </div>
          ))}
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
    </div>
  );
}

export default FiveDayData;
