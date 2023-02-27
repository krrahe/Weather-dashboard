const apiKey = "f55366a729e94f86bd5cbfbf957669b0";
const cities = [];

$(document).ready(() => {
  $("button").on("click", () => {
    const getWeather = $("#get-weather");
    const city = getWeather.val().trim();
    if (!city) {
      $(".invalid-message").html("Please enter a city.");
      return;
    }
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    renderCity(city);
    getWeatherData(city);
    getFiveDayData(city);
    $(".invalid-message").html("");
  });
});

function renderCity(city) {
  $(".search-data").prepend(`<p>${city}</p>`);
}

function getWeatherData(city) {
  const queryURL =  `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then((response) => {
    const iconCode = response.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    $(".city").html(`<h1>${response.name}</h1>`);
    $(".temp").text(`Temperature: ${((response.main.temp - 273.15) * 1.8 + 32).toFixed(0)} °F`);
    $(".humidity").text(`Humidity: ${response.main.humidity} %`);
    $(".wind").text(`Wind Speed: ${response.wind.speed} MPH`);
    $("#icon").attr("src", iconUrl);
    console.log("Wind Speed: " + response.wind.speed);
    console.log("Humidity: " + response.main.humidity);
    console.log("Temperature (F): " + response.main.temp);
  });
}

function getFiveDayData(city) {
  const fiveDayURL =  `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
  $.ajax({
    url: fiveDayURL,
    method: "GET",
  }).then((responseTwo) => {
    console.log(fiveDayURL);
    console.log(responseTwo);
    const days = [4, 12, 20, 28, 36];
    for (let i = 0; i < days.length; i++) {
      const day = responseTwo.list[days[i]];
      const date = day.dt_txt.substr(0, 10);
      const icon = day.weather[0].icon;
      const tempF = (day.main.temp - 273.15) * 1.8 + 32;
      const temp = tempF.toFixed(1);
      const humidity = day.main.humidity;
      const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
      $(`#day${i + 1}`).html(`<h4>${date}</h4>`);
      $(`#day${i + 1}`).append(`<img src=${iconUrl}>`);
      $(`#day${i + 1}`).append(`<p>Temp: ${temp} °F</p>`);
      $(`#day${i + 1}`).append(`<p>Humidity: ${humidity} %</p>`);
    }
  });
}

function getCities() {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.forEach((city) => {
    renderCity(city);
  });
}
getCities();

function currentWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );
        const data = await response.json();

        const iconCode = data.weather[0].icon;
        const iconurl = `http://openweathermap.org/img/w/${iconCode}.png`;

        $(".city").html(`<h1>${data.name}</h1>`);
        $(".temp").text(`Temperature: ${((data.main.temp - 273.15) * 1.8 + 32).toFixed(0)} °F`);
        $(".humidity").text(`Humidity: ${data.main.humidity} %`);
        $(".wind").text(`Wind Speed: ${data.wind.speed} MPH`);
        $("#wicon").attr("src", iconurl);
      } catch (error) {
        console.log("Error fetching weather data", error);
      }
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

currentWeather();

function forecast(apiKey) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const { latitude, longitude } = position.coords;

      try {
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
          .then((response) => response.json())
          .then((data) => {
            const icons = [];
            const temps = [];
            const humidities = [];
            const days = [];

            for (let i = 4; i < data.list.length; i += 8) {
              icons.push(data.list[i].weather[0].icon);
              temps.push(((data.list[i].main.temp - 273.15) * 1.8 + 32).toFixed(1));
              humidities.push(data.list[i].main.humidity);
              days.push(data.list[i].dt_txt.substr(0, 10));
            }

            $("#day1").html(`<h4>${days[0]}</h4><img src="http://openweathermap.org/img/w/${icons[0]}.png"><p>Temp: ${temps[0]} °F</p><p>Humidity: ${humidities[0]} %</p>`);
            $("#day2").html(`<h4>${days[1]}</h4><img src="http://openweathermap.org/img/w/${icons[1]}.png"><p>Temp: ${temps[1]} °F</p><p>Humidity: ${humidities[1]} %</p>`);
            $("#day3").html(`<h4>${days[2]}</h4><img src="http://openweathermap.org/img/w/${icons[2]}.png"><p>Temp: ${temps[2]} °F</p><p>Humidity: ${humidities[2]} %</p>`);
            $("#day4").html(`<h4>${days[3]}</h4><img src="http://openweathermap.org/img/w/${icons[3]}.png"><p>Temp: ${temps[3]} °F</p><p>Humidity: ${humidities[3]} %</p>`);
            $("#day5").html(`<h4>${days[4]}</h4><img src="http://openweathermap.org/img/w/${icons[4]}.png"><p>Temp: ${temps[4]} °F</p><p>Humidity: ${humidities[4]} %</p>`);
          });
      } catch (error) {
        console.log("Error fetching weather data", error);
      }
    });
  }
}