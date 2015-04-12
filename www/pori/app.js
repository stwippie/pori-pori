/**
 * Created by Stwippie on 07/04/15.
 */
angular.module('app', [])

  .controller('MainCtrl', function($scope) {
    const NUMOFPORINGS = 4;
    var items = $scope.items = [
      {
        name: 'Poring',
        id: 'poring',
        reward: 5,
        sprite: 'images/poring.gif',
        evolve: 'angeling'
      },
      {
        name: 'Drops',
        id: 'drops',
        reward: 5,
        sprite: 'images/drops.gif',
        evolve: 'metalling'
      },
      {
        name: 'Poporing',
        id: 'poporing',
        reward: 5,
        sprite: 'images/poporing.gif',
        evolve: 'stapo'
      },
      {
        name: 'Marin',
        id: 'marin',
        reward: 5,
        sprite: 'images/marin.gif',
        evolve: 'deviling'
      },
      {
        name: 'Stapo',
        id: 'stapo',
        reward: 15,
        sprite: 'images/stapo.gif',
        evolve: 'magmaring'
      },
      {
        name: 'Metalling',
        id: 'metalling',
        reward: 15,
        sprite: 'images/metalling.gif',
        evolve: 'heavymetalling'
      },
      {
        name: 'Angeling',
        id: 'angeling',
        reward: 15,
        sprite: 'images/angeling.gif',
        evolve: 'arcangeling'
      },
      {
        name: 'Deviling',
        id: 'deviling',
        reward: 15,
        sprite: 'images/deviling.gif',
        evolve: 'ghostring'
      },
      {
        name: 'Magmaring',
        id: 'magmaring',
        reward: 45,
        sprite: 'images/magmaring.gif'
      },
      {
        name: 'Heavy Metalling',
        id: 'heavymetalling',
        reward: 45,
        sprite: 'images/heavymetalling.gif'
      },
      {
        name: 'Arc Angeling',
        id: 'arcangeling',
        reward: 45,
        sprite: 'images/arcangeling.gif'
      },
      {
        name: 'Ghostring',
        id: 'ghostring',
        reward: 45,
        sprite: 'images/ghostring.gif'
      }
    ];

    var itemById = $scope.itemById = {};

    items.forEach(function(item) {
      itemById[item.id] = item;
    });

    var cells = $scope.cells = [];

    var externalCell = $scope.externalCell = {};

    var poring = null;

    $scope.click = click;

    var player = $scope.player = {
      reward: 0
    };

    $scope.playAgain = playAgain;

    $scope.gameOver = false;

    function getRandomPoring() {
      var num = Math.floor(Math.random()*101);
      var firstClass = items.filter(function(item){
        return item.reward === 5
      });
      var secondClass = items.filter(function(item){
        return item.reward === 15
      });
      var thirdClass = items.filter(function(item){
        return item.reward === 45
      });
      if (num === 0) {
        return thirdClass[Math.floor(Math.random()*thirdClass.length)];
      } else if (num > 0 && num < 10) {
        return secondClass[Math.floor(Math.random()*secondClass.length)];
      } else {
        return firstClass[Math.floor(Math.random()*firstClass.length)];
      }
    }

    function getRandomCell() {
      return cells[Math.floor(Math.random()*6)][Math.floor(Math.random()*6)];
    }

    function fillCells(poringLeft) {
      cells = $scope.cells = [
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}]
      ];
      while (poringLeft) {
        var cell = getRandomCell();
        if (!cell.item) {
          cell.item = getRandomPoring();
          poringLeft--;
        }
      }
    }

    fillCells(NUMOFPORINGS);

    function fillExternalCell() {
      externalCell.item = poring;
    }

    function nextPoring() {
      poring = getRandomPoring();
      fillExternalCell();
    }

    nextPoring();

    function click(row, col) {
      var cell = cells[row][col];
      if (cell.item) {
        return;
      }
      cell.item = poring;
      while(cell.item && checkGroups(row, col, cell.item.id)) {}
      nextPoring();
      isGameOver();
    }

    function getCell(row, col) {
      if (row < 0 || row > 5 || col < 0 || col > 5) {
        return null;
      }
      return cells[row][col];
    }

    function checkGroups(row, col, id) {
      var groups = [
        [getCell(row, col), getCell(row - 1, col), getCell(row + 1, col)],
        [getCell(row, col), getCell(row - 1, col), getCell(row - 2, col)],
        [getCell(row, col), getCell(row + 1, col), getCell(row + 2, col)],
        [getCell(row, col), getCell(row, col - 1), getCell(row, col + 1)],
        [getCell(row, col), getCell(row, col - 1), getCell(row, col - 2)],
        [getCell(row, col), getCell(row, col + 1), getCell(row, col + 2)],
        [getCell(row, col), getCell(row, col - 1), getCell(row + 1, col - 1)],
        [getCell(row, col), getCell(row, col + 1), getCell(row + 1, col)],
        [getCell(row, col), getCell(row - 1, col), getCell(row - 1, col + 1)],
        [getCell(row, col), getCell(row, col + 1), getCell(row + 1, col + 1)],
        [getCell(row, col), getCell(row, col - 1), getCell(row + 1, col)],
        [getCell(row, col), getCell(row - 1, col - 1), getCell(row - 1, col)],
        [getCell(row, col), getCell(row, col - 1), getCell(row - 1, col - 1)],
        [getCell(row, col), getCell(row - 1, col), getCell(row, col + 1)],
        [getCell(row, col), getCell(row + 1, col), getCell(row + 1, col + 1)],
        [getCell(row, col), getCell(row, col + 1), getCell(row - 1, col + 1)],
        [getCell(row, col), getCell(row, col - 1), getCell(row - 1, col)],
        [getCell(row, col), getCell(row + 1, col - 1), getCell(row + 1, col)]
      ];
      var valid = false;
      groups.forEach(function(cells) {
        if (checkGroup(cells, id)) {
          valid = true;
        }
      });
      if (valid) {
        var cell = getCell(row, col);
        cell.remove = false;
        cell.evolve = true;
        postCheck();
        return true;
      }
    }

    function postCheck() {
      cells.forEach(function(row) {
        row.forEach(function(cell){
          if (cell.remove) {
            player.reward += cell.item.reward;
            cell.item = null;
          } else if (cell.evolve) {
            var id = cell.item.evolve;
            player.reward += cell.item.reward;
            cell.item = itemById[id];
          }
          cell.remove = false;
          cell.evolve = false;
        })
      });

    }

    function checkGroup(cells, id) {
      var validCells = cells.filter(function (cell) {
        return cell && cell.item && cell.item.id === id;
      });
      if (validCells.length !== cells.length) {
        return false;
      }
      cells.forEach(function (cell) {
        cell.remove = true;
      });
      return true;
    }

    function isGameOver() {
      var flag = true;
      cells.forEach(function(row) {
        row.forEach(function(cell){
          if (!cell.item) {
            flag = false;
          }
        })
      });
      if(flag) {
        $scope.gameOver = true;
      }
    }

    function playAgain() {
      fillCells(NUMOFPORINGS);
      $scope.gameOver = false;
    }

  });
