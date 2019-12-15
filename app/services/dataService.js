app.factory('dataService', function ($http) {
  return {
    getGames: function () {
      return $http({
        method: 'GET',
        url: 'games/games.json'
      })
    }
  }
})