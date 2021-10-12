// Checks if the number is anywhere else in its row, column or subgrid (assumed 3x3).
// Returns true if the number is not repeated in the row, column or subgrid, false otherwise.
// @param {array} grid - a 2 dimentional 9x9 array containing only the digits 0-9
// @param {number} number - the number to be checked in a given position from 1-9
// @param {number} row - the row of the number to be checked from 0-8
// @param {number} column - the column of the number to be checked from 0-8
// @returns {boolean}
const isValidPlacement = function (grid, number, row, column) {
  // Checks that the number is not in the row
  for (let numberInRow of grid[row]) {
    if (number === numberInRow) {
      return false
    }
  }

  // Checks that the number is not in the column
  for (let i = 0; i < 9; i++) {
    let numberInColumn = grid[i][column]
    if (number === numberInColumn) {
      return false
    }
  }

  // Checks that the number is not in the 3x3 subgrid
  const subgridRow = Math.floor(row / 3)
  const subgridColumn = Math.floor(column / 3)
  // Goes to the correct subgrid row and column, then iterates through each element
  // in said subgrid and checks that number does not already exist there
  for (let tempRow = subgridRow * 3; tempRow < subgridRow * 3 + 3; tempRow++) {
    for (
      let tempColumn = subgridColumn * 3;
      tempColumn < subgridColumn * 3 + 3;
      tempColumn++
    ) {
      if (number === grid[tempRow][tempColumn]) {
        return false
      }
    }
  }

  // If no test for duplicates fails, then the placement is valid
  return true
}

// This global variable is important for storing the output of the solveGrid function
// in a primitive data type.
var gridPrimitive

// Gets a solution to the given sudoku grid. Returns undefined if the grid is unsolvable
// by means of trying solutions. NOTE that this does not apply to situations where the
// grid is unsolvable at the start. E.g. if there is a place on the grid where no number
// 1-9 satisfies a soluton, this function will return undefined. However, if the grid
// already contains duplicate numbers in a row, column, or subgrid, a solution will
// still be generated for the invalid starting grid.
// @param {array} grid - a 2 dimentional 9x9 array containing only the digits 0-9
// @returns {array} or {undefined}
const solveGrid = function (grid) {
  // Iterates through each position on the grid, stopping to try solutions if
  // they arrive at a position that does not have one yet (noted as the value 0)
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      if (grid[row][column] === 0) {
        // If there is no attempted solution yet (as the value is 0), all
        // numbers from 1-9 are tried
        for (let numberToTry = 1; numberToTry < 10; numberToTry++) {
          // If the number can be put there without breaking any constraints,
          // a new solution is generated and continued by recursion
          if (isValidPlacement(grid, numberToTry, row, column)) {
            grid[row][column] = numberToTry
            solveGrid(grid)
            grid[row][column] = 0 // as mentioned below, this sets the solution to unsolved
          }
        }
        // The function only reaches here if all numbers 1-9 were not solutions
        // This means that the previous solution must have been incorrect, so
        // the function ends and the grid is set to unsolved.
        return
      }
    }
  }

  // The grid needs to be saved as a primitive data type. If this is saved in
  // an array form, it is prone to strange bugs such as the array resetting.
  // These bugs are avoided by saving as a primitive.
  gridPrimitive = `${grid}`
}

// Takes a string containing 81 numbers separated by ',' and converts it into
// a 9x9 2 dimentional array where each 9 numbers segment in the string 
// constitutes a row. The intention of this function is to get a coherent array
// from a sudoku solution returned in grid format.
// @param {string} string - the string containing 81 numbers separated by ','
// @returns {array}
const gridPrimitiveToArray = string => {
  let rawGridNumbers = string.split(',')
  let sortedArray = []
  let tempArray = []
  for (let i = 0; i < 9; i++) {
    // Initialises the current row array that will be pushed to the final
    // array (this will happen 9 times)
    tempArray = []
    for (let i = 0; i < 9; i++) {
      // Adds each number from the rawGridNumbers one at a time, then removes them
      // from left to right
      tempArray.push(parseInt(rawGridNumbers.shift()))
    }
    sortedArray.push(tempArray)
  }
  return sortedArray
}

/*
Checks if a grid is a valid sudoku solution, assuming it only contains
correct digits 1-9. Returns true if the array is a solution, false otherwise.
@param {array} grid - a 9x9 2 dimentional array
@returns {boolean}
*/
const validateFullGrid = grid => {
  // Places all values of each row in a set. If the length of the set is not 9, 
  // there were duplicates meaning the sudoku is not valid
  for (let i = 0; i < 9; i++) {
    let tempArray = [...new Set(grid[i])]
    if (tempArray.length != 9) {
      return false
    }
  }

  // Places all values of each column in a set. If the length of the set is not 9, 
  // there were duplicates meaning the sudoku is not valid
  for (let column = 0; column < 9; column++) {
    let tempArray = []
    for (let row = 0; row < 9; row++) {
      tempArray.push(grid[row][column])
    }
    tempArray = [...new Set(tempArray)]
    if (tempArray.length != 9) {
      return false
    }
  }

  // For each number, it checks if the number appears again in its subgrid.
  for (let column = 0; column < 9; column++) {
    for (let row = 0; row < 9; row++) {
      // calculates and then iterates through each number in the subgrid
      const subgridRow = Math.floor(row / 3)
      const subgridColumn = Math.floor(column / 3)
      for ( // This iterates through the subgrid rows
        let tempRow = subgridRow * 3;
        tempRow < subgridRow * 3 + 3;
        tempRow++
      ) {
        for ( // This iterates through the subgrid columns
          let tempColumn = subgridColumn * 3;
          tempColumn < subgridColumn * 3 + 3;
          tempColumn++
        ) {
          if ( // If the number is found in the subgrid and it isn't
               // the number being checked, then the sudoku grid isn't valid
            grid[row][column] === grid[tempRow][tempColumn] &&
            (row != tempRow || column != tempColumn)
          ) {
            return false
          }
        }
      }
    }
  }

  return true
}

// Returns the solution if the solution found for a sudoku is valid
// otherwise returns null
// @param {array} grid - a 9x9 2 dimentional array
// @returns {array}
const getGridSolution = grid => {
  solveGrid(grid)
  if (!gridPrimitive) {
    console.log("Sudoku solution could not be calculated.")
    return false;
  }
  const solution = gridPrimitiveToArray(gridPrimitive)
  if (validateFullGrid(solution)) {
    return solution
  } else {
    console.log("There are no valid solutions to this sudoku.")
    return false;
  }
}

module.exports = getGridSolution
