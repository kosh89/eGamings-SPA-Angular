const app = angular
  .module('myModule', ['angularUtils.directives.dirPagination'])
  .controller('myController', function ($scope, dataService) {
    $scope.category = '';
    $scope.merchant = '';
    $scope.isDataLoad = false;

    dataService.getGames()
      .then((response) => {
        $scope.isDataLoad = true;
        $scope.games = response.data;
      })
      .catch(() => {
        $scope.isDataLoad = false;
      });

    $scope.gamesOnPageValues = [
      {text: 30, value: 30},
      {text: 50, value: 50},
      {text: 100, value: 100},
      {text: 200, value: 200}
    ];

    $scope.sortColumnValues = [
      {text: 'Name', value: 'Name.en'},
      {text: 'Merchant', value: 'MerchantID'}
    ];

    $scope.reverseSortValues = [
      {text: 'ASC', value: false},
      {text: 'DESC', value: true}
    ];

    $scope.gamesOnPage = $scope.gamesOnPageValues[0];
    $scope.sortColumn = $scope.sortColumnValues[0];
    $scope.reverseSort = $scope.reverseSortValues[0];

    $scope.resetReverseSort = function () {
      $scope.reverseSort = $scope.reverseSortValues[0];
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
      const dataFromLocalStorage = localStorage.getItem('favoriteGames');
      if (dataFromLocalStorage && typeof JSON.parse(dataFromLocalStorage) === 'object') {
        $scope.favoriteGames = JSON.parse(dataFromLocalStorage);
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

    $scope.showFavoriteFirst = function (game) {
      return $scope.favoriteGames.includes(game.ID.toString()) ? false : true;
    }

    $scope.loadFromLocalStorage();
  })
