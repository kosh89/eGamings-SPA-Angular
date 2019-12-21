const app = angular
  .module('myModule', [])
  .controller('myController', function ($scope, dataService) {
    $scope.filtersTemplate = 'templates/Filters.html';
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
      { text: 30, value: 30 },
      { text: 50, value: 50 },
      { text: 100, value: 100 },
      { text: 200, value: 200 }
    ];

    $scope.sortColumnValues = [
      { text: 'Name', value: 'Name.en' },
      { text: 'Merchant', value: 'MerchantID' }
    ];

    $scope.reverseSortValues = [
      { text: 'ASC', value: false },
      { text: 'DESC', value: true }
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

    /* === filter === */
    /* $scope.showFavoriteFirst = (game) => $scope.favoriteGames.includes(game.ID.toString()) ? false : true; */

    $scope.filterGames = (games) => {
      if (games) {
        let filteredGames = games.slice();
        const sortColumn = $scope.sortColumn.value;
        const reverseSort = $scope.reverseSort.value;
        const favoriteOnly = $scope.favoriteOnly;
        const favoriteGames = $scope.favoriteGames;
        const category = $scope.category;
        const merchant = $scope.merchant;
        let favoriteNewIndex = 0;

        if (sortColumn === 'Name.en') {
          filteredGames.sort((a, b) => {
            if (a.Name.en > b.Name.en) return 1;
            if (a.Name.en < b.Name.en) return -1;
            return 0;
          })
        }

        if (sortColumn === 'MerchantID') {
          filteredGames.sort((a, b) => a.MerchantID - b.MerchantID);
        }

        if (reverseSort) {
          filteredGames.reverse();
        }

        if (favoriteOnly) {
          filteredGames = filteredGames.filter((game) => favoriteGames.includes(game.ID))
        }

        if (category) {
          filteredGames = filteredGames.filter((game) => game.CategoryID.includes(category));
        }

        if (merchant) {
          filteredGames = filteredGames.filter((game) => game.MerchantID === merchant);
        }

        filteredGames.forEach((game, index) => {
          if (favoriteGames.includes(game.ID.toString())) {
            let favoriteGame = filteredGames.splice(index, 1)[0];
            filteredGames.splice(favoriteNewIndex, 0, favoriteGame);
            favoriteNewIndex += 1;
          }
        })

        return $scope.filteredGames = filteredGames;
      }
    };
    /* === filter === */

    /* ===== pagination ===== */
    $scope.startWith = 0;
    $scope.currentPage = 1;

    $scope.prevClick = () => {
      $scope.currentPage -= 1;
      $scope.startWith -= $scope.gamesOnPage.value;
    }

    $scope.nextClick = () => {
      $scope.currentPage += 1;
      $scope.startWith += $scope.gamesOnPage.value;
    }

    $scope.currentPageReset = () => {
      $scope.startWith = 0;
      $scope.currentPage = 1;
    }

    $scope.pageCount = () => {
      if ($scope.filteredGames) {
        return Math.ceil($scope.filteredGames.length / $scope.gamesOnPage.value)
      }
    };
    /* ===== pagination ===== */

    $scope.loadFromLocalStorage();
  })
