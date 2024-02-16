const blockSize = 50;
const gridBlockSize = 60;
const form = document.querySelector("inputmessage");
const canvas = document.querySelector(".myCanvas");
const width = (canvas.width = 400);
const height = (canvas.height = 300);
const maxRowLen = 10;
const ctx = canvas.getContext("2d");
var blockSelected = false;
var submitted_message;
var puzzleSolved = false;

canvas.addEventListener("mousedown", handleMouseDown);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const url = location.pathname;
const id = url.slice(8);
submitted_message = document.getElementById("secretMessage").value;

function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
}

class Block {
  constructor(x, y, char, index) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.selected = false;
    this.width = blockSize;
    this.height = blockSize;
    this.index = index;
    this.isCorrect = false;
    this.selectedFirst = false;
  }
  drawBlock() {
    if (this.isCorrect) {
      ctx.fillStyle = "orange";
    } else {
      ctx.fillStyle = "purple";
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.font = "40px serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var midpointX = this.x + (blockSize / 2);
    var midpointY = this.y + (blockSize / 2);
    ctx.fillText(this.char, midpointX, midpointY, blockSize);
  }
}

function drawBlocks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  blocks.forEach((block) => {
    block.drawBlock();
  });
}

function getBlockChar(index) {
  len = blocks.length;
  for (let i = 0; i < len; i++) {
    curBlock = blocks[i];
    if (curBlock.index == index) {
      return curBlock.char;
    }
  }
  return 0;
}

let blocks = [];

function handleMouseDown(event) {
  getMousePosition(canvas, event);
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  if (blockSelected) { //move
    blocks.forEach((block) => {
      if (
        x >= block.x &&
        x <= block.x + blockSize &&
        y >= block.y &&
        y <= block.y + blockSize
      ) {
        block.selected = true;
        moveBlock();
      }
    });
  } else {
    blocks.forEach((block) => {
      if (
        x >= block.x &&
        x <= block.x + blockSize &&
        y >= block.y &&
        y <= block.y + blockSize
      ) {
        block.selected = true;
        block.selectedFirst = true;
        highlightSelected(block);
        blockSelected = true;
      }
    });
  }
}

function highlightSelected(selectedBlock) {
  // clear selected from others
  blocks.forEach((block) => {
    block.selected = false;
    selectedBlock.selected = true;
    drawBlocks();
    ctx.fillStyle = "blue";
    ctx.fillRect(selectedBlock.x, selectedBlock.y, blockSize, blockSize);
  });
}

function checkForSuccess() {
  blocks.forEach((block) => {
    if (!(block.isCorrect)) {
      let blockChar = getBlockChar(block.index);
      if (blockChar == submitted_message.charAt(block.index)) {
        block.isCorrect = true;
      }
    }
  });
}

function unhighlightBlocks() {
  blocks.forEach((block) => {
    block.selected = false;
    block.selectedFirst = false;
    drawBlocks();
  });
}

function getNumSelected() {
  var numSelected = 0;
  blocks.forEach((block) => {
    if (block.selected) {
      numSelected += 1;
    }
  });
  return numSelected;
}

function moveBlock() {
  let firstTempX = 0;
  let firstTempY = 0;
  let secondTempX = 0;
  let secondTempY = 0;
  let firstTempIndex = 0;
  let secondTempIndex = 0;
  if (getNumSelected() == 2) {
    blocks.forEach((block) => {
      if (block.selected) {
        if (block.selectedFirst) {
          firstTempX = block.x;
          firstTempY = block.y;
          console.log("Test 1: First: (x,y): " + firstTempX + ", " + firstTempY);
          firstTempIndex = block.index;
          console.log(firstTempIndex);
        } else {
          secondTempX = block.x;
          secondTempY = block.y;
          console.log("Test 1: Second: (x,y): " + secondTempX + ", " + secondTempY);
          secondTempIndex = block.index;
          console.log(secondTempIndex);
        }
      }
    });
    blocks.forEach((block) => {
      if (block.selected) {
        if (block.selectedFirst) {
          block.x = secondTempX;
          block.y = secondTempY;
          console.log("First: (x,y): " + block.x + ", " + block.y);
          block.index = secondTempIndex;
        } else {
          block.x = firstTempX;
          block.y = firstTempY;
          console.log("Second: (x,y): " + block.x + ", " + block.y);
          block.index = firstTempIndex;
        }
      }
    });
    checkForSuccess();
    blockSelected = false;
    unhighlightBlocks();
  }
}

function shuffle(inputString) {
  let string = inputString;
  var output = "";
  string = string.split("");
  while (string.length > 0) {
    output += string.splice((string.length * Math.random()) << 0, 1);
  }
  return output;
}

function generatePuzzle(inputMessage) {
  console.log("message: " + inputMessage);
  len = inputMessage.length;
  console.log("Len: " + len);
  let xVal = 10;
  let yVal = 10;
  var shuffled = shuffle(inputMessage);
  console.log("Shuffled: " + shuffled);
  let numRows = Math.ceil(len / maxRowLen);
  console.log("numRows: " + numRows);
  if (len < maxRowLen) {
    blocksPerRow = len;
  } else {
    blocksPerRow = maxRowLen;
  }
  
  console.log("blocksPerRow: " + blocksPerRow);

  let blocksRemaining = len;

  while (blocksRemaining > 0){
    for (let i = 1; i < len && blocksRemaining > 0; i++){
      console.log("Inside I, index: " + i);
      xVal = 10;
      i--;
      for (let j = 0; j < blocksPerRow && blocksRemaining > 0; j++){
        console.log("Inside J, index: " + j);

        const block = new Block(xVal, yVal, shuffled.charAt(i), i);
        console.log("Generating block. Char: " + shuffled.charAt(i) + "Index: " + i);
        blocks.push(block);
        xVal = xVal + blockSize + 5;
        i++;
        blocksRemaining--;
        console.log("Blocks remaining: " + blocksRemaining);
      }
      yVal = yVal + (blockSize + 10);
    }
  }
  canvas.width = (blocksPerRow * (blockSize + 10));
  canvas.height = ((numRows) * (blockSize + 10) + 10);
  drawBlocks();
}

function displayMessage(score) {
  msg = document.getElementById("testmessage");
  if (score == 0) {
    msg.innerHTML = "Great job!!!";
  } else {
    msg.innerHTML = "Try Again!";
  }
}
generatePuzzle(submitted_message);

