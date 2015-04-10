/**
 * Created by Stwippie on 07/04/15.
 */
angular.module('app', [])

  .controller('MainCtrl', function($scope) {
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
        reward: 10,
        sprite: 'images/stapo.gif',
        evolve: 'magmaring'
      },
      {
        name: 'Metalling',
        id: 'metalling',
        reward: 10,
        sprite: 'images/metalling.gif',
        evolve: 'heavymetalling'
      },
      {
        name: 'Angeling',
        id: 'angeling',
        reward: 10,
        sprite: 'images/angeling.gif',
        evolve: 'arcangeling'
      },
      {
        name: 'Deviling',
        id: 'deviling',
        reward: 10,
        sprite: 'images/deviling.gif',
        evolve: 'ghostring'
      },
      {
        name: 'Magmaring',
        id: 'magmaring',
        reward: 100,
        sprite: 'images/magmaring.gif'
      },
      {
        name: 'Heavy Metalling',
        id: 'heavymetalling',
        reward: 100,
        sprite: 'images/heavymetalling.gif'
      },
      {
        name: 'Arc Angeling',
        id: 'arcangeling',
        reward: 100,
        sprite: 'images/arcangeling.gif'
      },
      {
        name: 'Ghostring',
        id: 'ghostring',
        reward: 100,
        sprite: 'images/ghostring.gif'
      }
    ];

    var itemById = $scope.itemById = {};

    items.forEach(function(item) {
      itemById[item.id] = item;
    });

    var cells = $scope.cells = [
      [{}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}]
    ];

    var externalCell = $scope.externalCell = {};

    var poring = null;

    $scope.click = click;

    function getRandomPoring() {
      return items[Math.floor(Math.random()*items.length)];
    }

    function getRandomCell() {
      return cells[Math.floor(Math.random()*6)][Math.floor(Math.random()*6)];
    }

    function fillCells(poringLeft) {
      while (poringLeft) {
        var cell = getRandomCell();
        if (!cell.item) {
          cell.item = getRandomPoring();
          poringLeft--;
        }
      }
    }

    fillCells(4);

    function fillExternalCell() {
      externalCell.item = poring;
    }

    function nextPoring() {
      poring = getRandomPoring();
      fillExternalCell();
    }

    nextPoring();

    function click(row, col) {
      console.log(row, col);
      var cell = cells[row][col];
      if (cell.item) {
        return;
      }
      cell.item = poring;
      checkGroups(row, col, poring.id);
      nextPoring();
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
        [getCell(row, col), getCell(row, col + 1), getCell(row + 1, col + 1)],
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
      }
    }

    function postCheck() {
      cells.forEach(function(row) {
        row.forEach(function(cell){
          if (cell.remove) {
            cell.item = null;
          } else if (cell.evolve) {
            var id = cell.item.evolve;
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


  });
