"use strict";

/**
 * Blueprint for Duck. Encapsulates the duck's position and direction.
 */
class Duck {
  constructor(row, col, dir) {
    this.row = row;
    this.col = col;
    this.dir = dir;
  }

  print() {
    console.log(this.row + " " + this.col + " " + this.dir);
  }
}

/**
 * Blueprint for GoldenPond. Encapsulates the pond and simulation logic.
 */
class GoldenPond {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this._initPond();
  }

  /**
   * Initialize pond
   */
  _initPond(){
    this.board = new Array(this.rows);
    for (var r = 0; r < this.rows; r++) {
      this.board[r] = new Array(this.cols);
      for (var c = 0; c < this.cols; c++) {
        this.board[r][c] = '.';
      }
    }
  }

  /**
   * Encapsulates the logic for updating a duck's direction.
   */
  updateDirection(duck, command){
    // give numbers to all the directions
    // key value pair using dictionary for direction to number
    var dirToNum = {'N': 1, 'W': 2, 'S': 3, 'E': 4};
    // key value pair using dictionary for number to direction
    var numToDir = {1: 'N', 2: 'W', 3: 'S', 4: 'E'};

    // get number of the currect direction and save in variable
    var val = dirToNum[duck.dir];

    if(command === 'S'){
      // if moving starboard side i.e. right then subtract
      val -= 1;
      if(val < 1){
        val = 4;
      }
    } else if (command === 'P') {
      // if moving port side i.e. left then add
      val += 1;
      if(val > 4){
        val = 1;
      }
    } else {
      console.log("Invalid change direction command: " + command);
      process.exit(1);
    }
    // convert computed number to direction again
    duck.dir = numToDir[val];
  }

  move(duck){
    // get the current direction
    var currentDirection = duck.dir;
    if(currentDirection === 'N'){
      //if north add 1 to the y co-ordinate
      duck.col += 1;
    }else if (currentDirection === 'S') {
      //if south subtract to the y co-ordinate
      duck.col -= 1;
    }else if (currentDirection === 'E') {
      //if east add to the x co-ordinate
      duck.row += 1;
    }else if (currentDirection === 'W') {
      // if west subtract to the x co-ordinate
      duck.row -= 1;
    }
  }

  /**
   * takes command to either move or update direction of duck
   */
  processCommands(duck, commands) {
    var command = commands.split("");
    // Split, for each char you'll invoke move OR updateDirection
    for (var i = 0; i < command.length; i++) {
      if(command[i] === 'P' || command[i] === 'S'){
        this.updateDirection(duck, command[i]);
      }else if(command[i] === 'F'){
        this.move(duck);
      }
    }
    return duck;
  }
}

/**
 * Simulator for the GoldenPond.
 */
function startSimuation(input) {
  var boardDimensions = input[0];
  var parts = boardDimensions.split(' ');
  var rows = parseInt(parts[0]);
  var cols = parseInt(parts[1]);
  var pond = new GoldenPond(rows, cols);
  for (var i = 1; i < input.length; i += 2) {
    var position = input[i];
    var commands = input[i+1];
    parts = position.split(' ');
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    var d = parts[2];
    var duck = new Duck(x, y, d);
    pond.processCommands(duck, commands);
    duck.print();
  }
}

function validate(input) {
  // Currently, just performs basic validation. Can be made exhaustive.
  // Minimum lines = 3 (1 board + 2 for each duck)
  var num = input.length;

  if (num < 3 || num % 2 != 1) {
    console.log("Invalid input received. Please provide a valid input");
    process.exit(1);
  }
}

// main function which takes the input and triggers simulation.
function main() {
  var readline = require('readline');
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  var input = [];
  rl.on('line', function(line){
    input.push(line);
  });

  // When reading of file is complete, perform validation
  // and then invoke startSimuation
  rl.on('close', function() {
    validate(input);
    // At this point we know that input is valid*. We can safely start simulation.
    startSimuation(input);
  });
}

// Entrypoint for the program.
main();
