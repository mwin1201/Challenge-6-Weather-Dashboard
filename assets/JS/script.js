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
    $("#card-container").empty();
    for (var i = 1; i < 6; i++) {
        var date = moment.unix(data.daily[i].dt).format("MM-DD-YYYY");
        $("#card-container").append(
            '<div class="card">' +
            '<div class="card-body">' + 
            '<h5 class="card-title">'+ date + '</h5>'+
            '<img class="weather-icon" src="' + "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png" +'"' + ' alt="' + data.daily[i].weather[0].description + '"/>' +
            '<p class="card-text">Temp: ' + data.daily[i].temp.day + '°F</p>' +
            '<p class="card-text">Wind: ' + data.daily[i].wind_speed + ' MPH</p>' +
            '<p class="card-text">Humidity: ' + data.daily[i].humidity + '%</p>'+
            '</div>' +
            '</div>'
        )
    }
};

var displayCurrentWeather = function(data,city) {
    $("#current-weather").empty();
    $("#current-weather").append('<h3 id="current-city">' + city + ' <span id="current-date">' + moment.unix(data.current.dt).format('MM-DD-YYYY') + '</span> <span id="weather-icon"> <img src="' + "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png" +'"' + ' alt="' + data.current.weather[0].description + '"/></span>');
    $("#current-weather").append('<p>Temperature: ' + data.current.temp + ' °F</p>');
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

$("#btnGroup").click(function(event) {
    var city = event.target.innerText;
    saveSearches(city);
    getLonAndLat(city);
});

loadSearchButtons();