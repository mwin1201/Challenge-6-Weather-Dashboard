//var currentWeatherEl = document.querySelector("#current-weather");
var savedCities = [];

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
    $("#current-weather").empty();
    $("#current-weather").append('<h3 id="current-city">' + city + ' <span id="current-date">' + moment.unix(data.current.dt).format('MM-DD-YYYY') + '</span> <span id="weather-icon">' + data.current.weather.icon + '</span>');
    $("#current-weather").append('<p>Temperature: ' + data.current.temp + ' Farenheit</p>');
    $("#current-weather").append('<p>Wind: ' + data.current.wind_speed + ' MPH</p>');
    $("#current-weather").append('<p>Humidity: ' + data.current.humidity + '%</p>');
    $("#current-weather").append('<p>UV Index: ' + data.current.uvi + '</p>');
};

var displaySearchButtons = function(saveSearchArr) {
    $("#btnGroup").html("");
    for (var i = saveSearchArr.length - 1; i >= 0; i--) {
        var buttonEl = document.createElement("button");
        buttonEl.classList.add("btn", "btn-light", "border", "border-dark", "my-2");
        buttonEl.textContent = saveSearchArr[i];
        $("#btnGroup").append(buttonEl);
    }
};

var saveSearches = function(city) {
    if (savedCities.length < 5) {
        savedCities.push(city);
    }
    else {
        savedCities.splice(0,1);
        savedCities.push(city);
    }
    localStorage.setItem("Searches", JSON.stringify(savedCities));
    displaySearchButtons(savedCities);
};

var loadSearchButtons = function() {
    if (localStorage.getItem("Searches")) {
        savedCities = JSON.parse(localStorage.getItem("Searches"));
    }
    displaySearchButtons(savedCities);
};

$("#searchBtn").click(function(event) {
    event.preventDefault();
    var city = $("#search-city").val();
    console.log(city);
    saveSearches(city);
    getLonAndLat(city);
});

loadSearchButtons();