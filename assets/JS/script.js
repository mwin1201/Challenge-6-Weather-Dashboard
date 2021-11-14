var currentWeatherEl = document.querySelector("#current-weather");

var getLonAndLat = function(city) {
    // getting weather data over 5 days with 3 hour steps
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=711a1093e77d9e3d07585442f8d5ee1b";
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lon = data.city.coord.lon;
                var lat = data.city.coord.lat;
                var city = data.city.name;
                console.log("lon: " + lon + " & lat: " + lat + " & city: " + city);
                getWeatherData(lon,lat,city);
            });
        }
        else {
            alert("There was an issue");
        }
    });
};


var getWeatherData = function(longitude,latitude,city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly,alerts&appid=711a1093e77d9e3d07585442f8d5ee1b";
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrentWeather(data,city);
                displayWeatherForecast(data);
            });
        }
    });
};

var displayWeatherForecast = function(data) {

};

var displayCurrentWeather = function(data,city) {
    console.log("in current weather");
    $("#current-city").text(city);
    $("#current-date").text(moment.unix(data.current.dt).format('MM-DD-YYYY'));
    $("#weather-icon").html(data.current.weather.icon);
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var uvIndexEl = document.createElement("p");
    tempEl.textContent = "Temperature: " + data.current.temp + "Farenheit";
    windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    uvIndexEl.textContent = "UV Index: " + data.current.uvi;
    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(windEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(uvIndexEl);
};


$("#searchBtn").click(function(event) {
    event.preventDefault();
    var city = $("#search-city").val();
    console.log(city);
    getLonAndLat(city);
});