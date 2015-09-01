var app = angular.module('myApp', ['ngAnimate']);

app.controller('appController', function($scope, Weather) {
  $scope.weatherData = {};
  $scope.weatherData.forecast = [];

  var numberToDay = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }

  $scope.updateForecast = function(location) {
    if (location.indexOf(',') === -1) {
      $scope.weatherData.cityName = 'Please enter a location in the format "City, State"';
      $scope.weatherData.forecast = [];
    } else {
      Weather.getWeatherData(location).then(function(data) {
        if (location.split(',')[0].toUpperCase() !== data.city.name.toUpperCase()) {
          $scope.weatherData.cityName = 'Please enter a valid location';
          $scope.weatherData.forecast = [];
        } else {
          $scope.weatherData.cityName = '5-Day Forecast for ' + data.city.name;
          for (var i = 0; i < data.list.length; i++) {
            var date = new Date(0);
            date.setUTCSeconds(data.list[i].dt);
            $scope.weatherData.forecast[i] = {
              'dayOfWeek': numberToDay[date.getDay()],
              'minTemp': Math.round(data.list[i].temp.min),
              'maxTemp': Math.round(data.list[i].temp.max),
              'avgTemp': Math.round((data.list[i].temp.min + data.list[i].temp.max) / 2),
              'humidity': data.list[i].humidity,
              'main': data.list[i].weather[0].main,
              'description': data.list[i].weather[0].description,
              'icon': data.list[i].weather[0].icon
            };
          }
        }
      })
    }
  };

})

app.factory('Weather', function($http) {
  var getWeatherData = function(location) {
    return $http({
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + location + '&units=imperial&cnt=5'
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  return {
    getWeatherData: getWeatherData
  };
});
