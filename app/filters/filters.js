app.filter('gamesFilter', () => {
  return (games, scope) => {
    let filtered = games;

    if (scope.favoriteOnly) {
      return games.filter((game) => scope.favoriteGames.includes(game.ID))
    }

    if (scope.category) {
      filtered = filtered.filter((game) => game.CategoryID.includes(scope.category));
    }

    if (scope.merchant) {
      filtered = filtered.filter((game) => game.MerchantID === scope.merchant);
    }

    return filtered;
  };
});