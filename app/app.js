angular
  .module('myModule', ['angularUtils.directives.dirPagination'])
  .controller('myController', function ($scope, $http) {
    var successCallback = function (response) {
      $scope.games = response.data;
    };

    var errorCallback = function (reason) {
      $scope.error = reason.data;
      document.querySelector('.info').textContent = 'An error occurred while loading games.';
    };

    $http({
      method: 'GET',
      url: 'games/games.json'})
      .then(successCallback, errorCallback);

    $scope.category = '';
    $scope.merchant = '';
    $scope.gamesOnPage = 30;
    $scope.sortColumn = 'Name.en';

    $scope.reverseSort = false;
    $scope.resetReverseSort = function () {
      $scope.reverseSort = false;
    }

    $scope.exactMatch = false;
    $scope.toggleExactMatch = function (cat) {
      cat ? $scope.exactMatch = true : $scope.exactMatch = false;
    }

    $scope.favoriteCheckboxes = {};
    $scope.favoriteGames = [];
    $scope.favoriteOnly = false;

    $scope.saveToLocalStorage = function () {
      localStorage.setItem('favoriteGames', JSON.stringify($scope.favoriteGames));
    };

    $scope.loadFromLocalStorage = function () {
      if (localStorage.getItem('favoriteGames') !== null) {
        $scope.favoriteGames = JSON.parse(localStorage.getItem('favoriteGames'));
        $scope.favoriteGames.forEach(function (id) {
          $scope.favoriteCheckboxes[id] = true;
        });
      };
    };

    $scope.favoriteAction = function (isFav, id) {
      isFav ? $scope.favoriteGames.push(id) : $scope.favoriteGames.splice($scope.favoriteGames.indexOf(id), 1)
      $scope.saveToLocalStorage();
    };

    $scope.isFavoritesEmpty = function () {
      if (Object.values($scope.favoriteGames).length === 0) {
        $scope.favoriteOnly = false;
        return true;
      };
    };

    $scope.filterFavorites = function (game) {
      if ($scope.favoriteOnly) {
        return $scope.favoriteGames.includes(game.ID);
      }
      return true;
    };

    $scope.showFavoriteFirst = function (game) {
      return $scope.favoriteGames.includes(game.ID.toString()) ? false : true;
    }

    $scope.loadFromLocalStorage();
  })