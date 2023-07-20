function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function showTemperatureAndData(response) {
  $("#img").attr(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather["0"].icon}@2x.png`
  );
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
  let weatherDescription = document.querySelector("#weather");
  let res = capitalizeFirstLetter(response.data.weather[0].description);
  weatherDescription.innerHTML = res;
  let mainDegree = document.querySelector("#main-degree");
  mainDegree.innerHTML = Math.round(response.data.main.temp);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  let precipitation = document.querySelector("#precipitation");
  if (response.data.rain) {
    precipitation.innerHTML = response.data.rain["1h"] * 100;
  } else {
    precipitation.innerHTML = "0";
  }
  let now = new Date(response.data.dt * 1000);

  let time = document.querySelector("#real-time");
  let hour = now.getHours();
  let minutes = now.getMinutes();
  time.innerHTML = `${pad(hour, 2)}:${pad(minutes, 2)}`;
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednsday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekDay = days[now.getDay()];
  let currentDay = document.querySelector("#current-day");
  currentDay.innerHTML = weekDay;
}
function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  axios
    .get(`${apiUrlWeather}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`)
    .then(showTemperatureAndData);
}
function getCurrentPosition(event) {
  navigator.geolocation.getCurrentPosition(showPosition);
}
function getLocationOfCity(position) {
  lat = position.data.coord.lat;
  lon = position.data.coord.lon;
  axios
    .get(`${apiUrlWeather}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`)
    .then(showTemperatureAndData);
}
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

let executedForC = true;
let executedForF = false;
function stopEventForC(event) {
  event.preventDefault();
  let buttonC = document.querySelector("#buttonDegreeC");
  let buttonF = document.querySelector("#buttonDegreeF");
  buttonC.style.color = "blue";

  buttonF.style.color = "black";
  buttonF.style.textDecoration = "none";
  let mainDegree = document.querySelector("#main-degree");

  if (!executedForC) {
    mainDegree.innerHTML = Math.round((5 / 9) * (mainDegree.innerHTML - 32));
    executedForF = false;
    executedForC = true;
  }
}
function stopEventForF(event) {
  event.preventDefault();
  let buttonC = document.querySelector("#buttonDegreeC");
  let buttonF = document.querySelector("#buttonDegreeF");
  buttonF.style.color = "blue";

  buttonC.style.color = "black";
  buttonC.style.textDecoration = "none";
  let mainDegree = document.querySelector("#main-degree");

  if (!executedForF) {
    mainDegree.innerHTML = Math.round(32 + (mainDegree.innerHTML * 9) / 5);
    executedForF = true;
    executedForC = false;
  }
}
function showCity(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#city-input");

  let city = document.querySelector("#city");

  if (inputCity.value) {
    let cityUp = capitalizeFirstLetter(inputCity.value);
    city.innerHTML = cityUp;
    axios
      .get(`${apiGeolocationOfCity}${city.innerHTML}&appid=${apiKey}`)
      .then(getLocationOfCity);
  }
}

let now = new Date();
let time = document.querySelector("#real-time");
let hour = now.getHours();
let minutes = now.getMinutes();
time.innerHTML = `${pad(hour, 2)}:${pad(minutes, 2)}`;

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednsday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekDay = days[now.getDay()];
let currentDay = document.querySelector("#current-day");
currentDay.innerHTML = weekDay;

const mainDegree1 = document.querySelector("#main-degree");

let buttonC = document.querySelector("#buttonDegreeC");
let buttonF = document.querySelector("#buttonDegreeF");
buttonC.addEventListener("click", stopEventForC);
buttonF.addEventListener("click", stopEventForF);

let apiKey = "83e448c2e1b20e8f79a4407296ad6e49";
let apiUrlWeather = "https://api.openweathermap.org/data/2.5/weather?";
let apiGeolocationOfCity = "https://api.openweathermap.org/data/2.5/weather?q=";
let lat;
let lon;
let form = document.querySelector("#input");
let units = "metric";
form.addEventListener("submit", showCity);

let buttonCurrentLocation = document.querySelector("#current-location");
buttonCurrentLocation.addEventListener("click", getCurrentPosition);
