window.onload = function () {
  getCurrentPosition();
};
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
    let percentofrain = Math.round(response.data.rain["1h"] * 100);
    precipitation.innerHTML = percentofrain;
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

  let todayForecast = document.querySelector("#forecast");
  let minTemp = Math.round(response.data.main.temp_min);
  let maxTemp = Math.round(response.data.main.temp_max);
  todayForecast.innerHTML = `<button class="day-buttons">
                  <div class="day-inside-of-button-another-days">${days[
                    now.getDay()
                  ].substring(0, 3)}</div>
                  <img
                    class="img-inside-of-button-another-days"
                    src="https://openweathermap.org/img/wn/${
                      response.data.weather["0"].icon
                    }@2x.png"
                  />
                  
                  <div class="temp-inside-of-button-another-days"><spam class="max_temp_button">${maxTemp}° </spam>
                   <spam class="min_temp_button">${minTemp}°</spam>
                  </div>
                </button>`;
  getForecast(response.data.coord);
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

function getForecast(cordinates) {
  let apiKey = "83e448c2e1b20e8f79a4407296ad6e49";

  let apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cordinates.lat}&lon=${cordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiURL).then(showForecast);
}
function showForecast(response) {
  let allTempMax = [];
  let allTempMin = [];
  let y = 0;
  for (let x = 0; x < 5; x++) {
    let temporaryTemp = [];
    let temporaryTemp1 = [];
    for (let o = 0; o < 8; o++) {
      temporaryTemp.push(response.data.list[y].main.temp_max);
      temporaryTemp1.push(response.data.list[y].main.temp_min);
      console.log(response.data.list[y].weather);
      y++;
    }

    allTempMin.push(Math.round(Math.min(...temporaryTemp1)));

    allTempMax.push(Math.round(Math.max(...temporaryTemp)));
  }

  let today = document.getElementById("current-day").innerHTML;

  let fulldays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednsday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let days_for_loop = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let days = [];

  for (let o = 0; o < 8; ) {
    if (today == fulldays[o]) {
      o++;

      for (let x = 0; x < 7; x++) {
        if (o == 7) {
          o = 0;
        }

        days.push(days_for_loop[o]);
        o++;
      }
      o = +8;
    }

    o++;
  }
  let img;
  for (let y = 4; y < 40; ) {
    img = `"https://openweathermap.org/img/wn/${response.data.list[y].weather["0"].icon}@2x.png"`;
    //img = `https://openweathermap.org/img/wn/04n@2x.png`;
    console.log(img);
    for (let i = 0; i < 5; i++) {
      let forecastElement = document.querySelector(`#forecast${i}`);
      let forecastHTML;

      forecastHTML = `<button class="day-buttons">
                  <div class="day-inside-of-button-another-days">${days[i]}</div>
                  <img
                    class="img-inside-of-button-another-days"
                    src=${img}
                  />
                  <div class="temp-inside-of-button-another-days"><spam class="max_temp_button">${allTempMax[i]}° </spam>
                   <spam class="min_temp_button">${allTempMin[i]}°</spam>
                  </div>
                </button>`;

      forecastElement.innerHTML = forecastHTML;
    }
    y = y + 8;
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
