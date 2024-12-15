let head_history;
let snake_length;
let last_arrow_pressed;
let apple_x;
let apple_y;
let tail;
let tail_direction;
let previous_keycode;
let game_started;
let score;
let status = "Press UP, RIGHT, or DOWN to start."; // Communications to player

let font;

function preload() {
  // Runs first
  font = loadFont("AguDisplay.ttf");
}

function setup() {
  // Runs after preload(), defines default varible values
  createCanvas(windowWidth, windowHeight);

  head_history = [[4, 7], [3, 7]];
  snake_length = 2;
  last_arrow_pressed = 'a'; // placeholder value
  apple_x = 13;
  apple_y = 7;
  tail = [4, 7];
  tail_direction = 'e';
  previous_keycode = 'a'; // placeholder value
  game_started = false;

  textFont(font, windowHeight/30);
  
  frameRate(60);
}

function draw() {
  /*
  PURPOSE: Runs every frame, displays visual elements and runs backend processing.
  */
  
  const square_width = windowHeight/19;

  clear();
  background(139, 69, 19);
  
  if (frameCount % 10 == 0) {

    if (head_history[0][0] == apple_x && head_history[0][1] == apple_y) {
      snake_length += 1;
      apple_handler();
    }

    backend_move_snake();
    
  }

  noStroke();

  fill(50, 30, 7);
  rect(square_width - square_width/2, square_width - square_width/2, square_width*18, square_width*16); // Dark square behind board
  
  for (let n = 1; n < 16; n++) {
    // Draws the checkered pattern on the board 

    if (n % 2 == 0) {
      for (let x = 1; x < 18; x++) {

        if (x % 2 == 0) {
          fill(153, 255, 102);
        }
        else {
          fill(255, 255, 153);
        }
        
        rect(square_width*x, square_width*n, square_width);
      }
    }
    else {
      for (let x = 1; x < 18; x++) {

        if (x % 2 == 0) {
          fill(255, 255, 153);
        }
        else {
          fill(153, 255, 102);
        }
        
        rect(square_width*x, square_width*n, square_width);
      }
    }
  }

  fill(255, 0, 0);
  
  // display the apple
  rect(square_width*apple_x + square_width, square_width*apple_y + square_width, square_width);

  fill(0, 200, 0);

  if (game_started == true) { // Draw smooth movement head & tail
    snake_animation();
  }
  
  for (let n = 1; n < snake_length; n++) { // Draw snake's body
    rect(square_width*head_history[n][0] + square_width, square_width*head_history[n][1] + square_width, square_width);
  }

  score = snake_length - 2;

  text("Score: " + score, square_width*19, square_width*8.7); // Draw player's score in text
  text(status, square_width*19, square_width*9.7);

  stroke(0);
  fill(255, 255, 255);
  
}
  
function backend_move_snake() {
  /*
  PURPOSE: Sets new snake position and checks for win/loss
  */
  
  let new_head_posx = head_history[0][0];
  let new_head_posy = head_history[0][1];
  
  if (game_started == true) {
    if (last_arrow_pressed == UP_ARROW && head_history[1][1] != head_history[0][1] - 1) { // This set of ifs only runs if the keypress isn't in the direction that will cause instant loss
      new_head_posy -= 1;
    }
    else if (last_arrow_pressed == RIGHT_ARROW && head_history[1][0] != head_history[0][0] + 1) {
      new_head_posx += 1;
    }
    else if (last_arrow_pressed == DOWN_ARROW && head_history[1][1] != head_history[0][1] + 1) {
      new_head_posy += 1;
    }
    else if (last_arrow_pressed == LEFT_ARROW && head_history[1][0] != head_history[0][0] - 1) {
      new_head_posx -= 1;
    }
    else { // This set will continue to move the snake in the same direction if the new keypress is invalid
      if (previous_keycode == UP_ARROW) {
        new_head_posy -= 1;
      }
      else if (previous_keycode == RIGHT_ARROW) {
        new_head_posx += 1;
      }
      else if (previous_keycode == DOWN_ARROW) {
        new_head_posy += 1;
      }
      else if (previous_keycode == LEFT_ARROW) {
        new_head_posx -= 1;
      }
    }
  
    head_history.unshift([new_head_posx, new_head_posy]); // Add new head position to corresponding position in history list
  }
  
  if (game_started == true) { // Calculate tail's direction of movement
    if (head_history[head_history.length - 1][0] + 1 == head_history[head_history.length - 2][0]) {
      tail_direction = 'e'; // east
    }
    else if (head_history[head_history.length - 1][1] + 1 == head_history[head_history.length - 2][1]) {
      tail_direction = 's'; // south
    }
    else if (head_history[head_history.length - 1][1] - 1 == head_history[head_history.length - 2][1]) {
      tail_direction = 'n'; // north
    }
    else if (head_history[head_history.length - 1][0] - 1 == head_history[head_history.length - 2][0]) {
      tail_direction = 'w'; // west
    }
  }
  
  tail = [head_history[head_history.length - 1][0] + 2, head_history[head_history.length - 1][1]]; // Record tail position

  if (head_history.length > snake_length) { // Move snake forward at the back
    head_history.pop();
  }
    
  if ((head_history[0][0] > 16 || head_history[0][0] < 0 || head_history[0][1] > 14 || head_history[0][1] < 0)) { // If the snake runs into a wall
    status = 'You concussed yourself against a wall! You lose.\nPress UP, RIGHT, or DOWN to play again.';
    frameRate(0);
    setTimeout(function(){setup()}, 1000); // Reset game after one second
  }

  for (let n = 1; n < head_history.length; n++) { // If the snake runs into itself (excludes the partial-square tail to ensure losses all make sense)
    if (head_history[0][0] == head_history[n][0] && head_history[0][1] == head_history [n][1]) {
      status = 'You bit yourself! You lose.\nPress UP, RIGHT, or DOWN to play again.';
      frameRate(0);
      setTimeout(function(){setup()}, 1000);
    }
  }

  if (snake_length >= 255) { // If the player reches the maximum length and fills the board
    status = 'You ate all the apples! You win!\nPress UP, RIGHT, or DOWN to play again.';
    frameRate(0);
    setTimeout(function(){setup()}, 1000);
  }
}


function keyPressed() {
  /*
  PURPOSE: Handles key presses, arrow keys in particular.
  */
  
  if ((keyCode == UP_ARROW || keyCode == RIGHT_ARROW || keyCode == DOWN_ARROW || (keyCode == LEFT_ARROW && game_started == true)) && keyCode != last_arrow_pressed) {  // filters out any non-arrow key presses

    status = ''; // Clear player communication text

    if (game_started == false) { // Sets the frame count to zero so that head does not get drawn halfway through a square immediately
      frameCount = 0;
    }
    
    game_started = true; // Change gameplay status variable
    
    previous_keycode = last_arrow_pressed; // Record previous key pressed for managing garbage-in garbage-out

    last_arrow_pressed = keyCode; // Set current direction

  }
}


function apple_handler() { // Handles the apple eating and spawning
  const square_width = windowHeight/19;

  intitial_apple = false;

  while (true) {
    apple_x = getRandomInt(17);
    apple_y = getRandomInt(15);
    
    if (isInArray([apple_x, apple_y], head_history) == false) {
      break;
    }
    
  }
}

function getRandomInt(max) { // taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

  /*
  PURPOSE: Generates random int
  */
  return Math.floor(Math.random() * max);
}

function isInArray(element, array) { // Custom array-searching function for the sole purpose of checking of two things have collided
  let in_array = false;
  
  for (let n = 0; n < array.length; n++) {
    if (array[n][0] == element[0] && array[n][1] == element[1]) {
      in_array = true;
    }
  }

  return in_array;
}

function snake_animation() {
  /*
  PURPOSE: Smooths snake movement using frame count remainders
  */
  const square_width = windowHeight/19;

  if (head_history[0][0] == head_history[1][0] + 1) { // Smooths the head movement
    rect(square_width*head_history[0][0] + square_width, square_width*head_history[0][1] + square_width, square_width*((frameCount % 10)/10), square_width)
  }
  else if (head_history[0][0] == head_history[1][0] - 1) {
    rect(square_width*head_history[0][0] + square_width + (square_width - square_width*((frameCount % 10)/10)), square_width*head_history[0][1] + square_width, square_width*((frameCount % 10)/10), square_width)
  }
  else if (head_history[0][1] == head_history[1][1] + 1) {
    rect(square_width*head_history[0][0] + square_width, square_width*head_history[0][1] + square_width, square_width, square_width*((frameCount % 10)/10))
  }
  else if (head_history[0][1] == head_history[1][1] - 1) {
    rect(square_width*head_history[0][0] + square_width, square_width*head_history[0][1] + square_width + (square_width - square_width*(frameCount % 10)/10), square_width, square_width*((frameCount % 10)/10))
  }

  
  if (tail_direction == 'e') { // Smooths the tail movement
    rect(tail[0]*square_width + square_width*((frameCount % 10)/10) - square_width, tail[1]*square_width + square_width, square_width - square_width*((frameCount % 10)/10), square_width)
  }
  else if (tail_direction == 'w') {
    rect(tail[0]*square_width - square_width, tail[1]*square_width + square_width, square_width - square_width*((frameCount % 10)/10), square_width)
  }
  else if (tail_direction == 's') {
    rect(tail[0]*square_width - square_width, tail[1]*square_width + square_width*((frameCount % 10)/10) + square_width, square_width, square_width - square_width*((frameCount % 10)/10))
  }
  else if (tail_direction == 'n') {
    rect(tail[0]*square_width - square_width, tail[1]*square_width + square_width, square_width, square_width - square_width*((frameCount % 10)/10))
  }
}
