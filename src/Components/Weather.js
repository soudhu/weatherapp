import React, { useEffect, useState } from "react";
import Apikey, { base } from "./Apikey";
import ReactAnimatedWeather from "react-animated-weather";
import Clock from "react-live-clock";
import Forcast from "./Forcast";
import loader from "../images/WeatherIcons.gif";

const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

export default function Weather() {
  const [lat, setlat] = useState(undefined);
  const [lon, setlon] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [temperatureC, setTemperatureC] = useState(undefined);
  const [temperatureF, setTemperatureF] = useState(undefined);
  const [city, setCity] = useState(undefined);
  const [country, setCountry] = useState(undefined);
  const [humidity, setHumidity] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [icon, setIcon] = useState("CLEAR_DAY");

  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          getWeather(25.6, 85.12);
          alert(
            "You have disabled location service. Allow to access your location. Your current location will be used for calculating the Real time weather."
          );
        });
    } else {
      alert("Geolocation Not Available");
    }
    const timerID = setInterval(() => {
      getWeather(lat, lon);
    }, 300000);

    return () => {
      clearInterval(timerID);
    };
  });
  const getPosition = () => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };
  const getWeather = async (lat, lon) => {
    try {
      const api_call = await fetch(
        `${(Apikey, base)}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${
          Apikey.key
        }`
      );
      const data = await api_call.json();
      setlat(lat);
      setlon(lon);
      setCity(data.name);
      setTemperatureC(Math.round(data.main.temp));
      setTemperatureF(Math.round(data.main.temp * 1.8 + 32));
      setHumidity(data.main.humidity);
      setDescription(data.weather[0].main);
      setCountry(data.sys.country);

      switch (data.weather[0].main) {
        case "Haze":
          setIcon("CLEAR_DAY");
          break;
        case "Clouds":
          setIcon("CLOUDY");
          break;
        case "Rain":
          setIcon("RAIN");
          break;
        case "Snow":
          setIcon("SNOW");
          break;
        case "Dust":
          setIcon("WIND");
          break;
        case "Drizzle":
          setIcon("SLEET");
          break;
        case "Fog":
          setIcon("FOG");
          break;
        case "Smoke":
          setIcon("FOG");
          break;
        case "Tornado":
          setIcon("WIND");
          break;
        default:
          setIcon("CLEAR_DAY");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (temperatureC) {
    return (
      <>
        <div className="city">
          <div className="title">
            <h2>{city}</h2>
            <h3>{country}</h3>
          </div>
          <div className="mb-icon">
            {" "}
            <ReactAnimatedWeather
              icon={icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{description}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div className="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {temperatureC}°<span>C</span>
              </p>
              {/* <span className="slash">/</span>
                {temperatureF} &deg;F */}
            </div>
          </div>
        </div>
        <Forcast icon={icon} weather={description} />
      </>
    );
  } else {
    return (
      <>
        <img
          src={loader}
          style={{ width: "50%", WebkitUserDrag: "none" }}
          alt="Loading..."
        />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location will be displayed on the App and used for
          calculating Real-time weather.
        </h3>
      </>
    );
  }
}
