const blockSize = 50;
const gridBlockSize = 60;
const form = document.querySelector("inputmessage");
const canvas = document.querySelector(".myCanvas");
const width = (canvas.width = 400);
const height = (canvas.height = 300);
const maxRowLen = 10;
const ctx = canvas.getContext("2d");
var blockSelected = false;
var blankBlockSelected = false;
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
    this.isSelectable = true;
  }
  drawBlock() {
    if (!(this.isCorrect)) {
      ctx.fillStyle = "#00539F";
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
}

class BlankBlock {
  constructor(x, y, char, index) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.selected = false;
    this.width = blockSize;
    this.height = blockSize;
    this.index = index;
    this.isCorrect = false;
    this.isSelectable = true;
  }
  drawBlock() {
    var midpointX = this.x + (blockSize / 2);
    var midpointY = this.y + (blockSize / 2);
    if (this.char == " ") {
      this.isCorrect = true;
    } else if (this.isCorrect) {
      ctx.fillStyle = "cadetblue";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.font = "40px serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.char, midpointX, midpointY, blockSize);
    } else {
      ctx.fillStyle = "darkseagreen";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

function drawBlocks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  blocks.forEach((block) => {
    block.drawBlock();
  });
  blankBlocks.forEach((blankBlock) => {
    blankBlock.drawBlock();
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
let blankBlocks = [];
let selectedBlock = null;
let selectedBlankBlock = null;

function handleMouseDown(event) {
  getMousePosition(canvas, event);
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  blocks.forEach((block) => {
    if (
      (
        x >= block.x &&
        x <= block.x + blockSize &&
        y >= block.y &&
        y <= block.y + blockSize
      ) && (block.isSelectable)
    ) {
      block.selected = true;
      highlightSelected(block);
      blockSelected = true;
      selectedBlock = block;
    }
  });

  blankBlocks.forEach((blankBlock) => {
    if ((
      x >= blankBlock.x &&
      x <= blankBlock.x + blockSize &&
      y >= blankBlock.y &&
      y <= blankBlock.y + blockSize
    ) && blankBlock.isSelectable ){
      blankBlock.selected = true;
      blankBlockSelected = true;
      selectedBlankBlock = blankBlock;
      highlightSelected(blankBlock);
    }
  });

  if (blockSelected && blankBlockSelected) {
    console.log("testing char " + selectedBlock.char + "against char " + selectedBlankBlock.char);
    if (selectedBlock.char == selectedBlankBlock.char) {
      moveBlocks(selectedBlankBlock, selectedBlock);
    } else {
      unhighlightBlocks();
    }
  }
}

function moveBlocks(blankBlock, filledBlock){
    blankBlock.isCorrect = true;
    filledBlock.isCorrect = true;  
    blankBlock.isSelectable = false;
    filledBlock.isSelectable = false;
    blockSelected = false;
    blankBlockSelected = false;
    unhighlightBlocks();
    if (checkForSuccess()) {
      displayMessage(0);
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
  let solved = true;
  blankBlocks.forEach((blankBlock) => {
    if (!(blankBlock.isCorrect)) {
      solved = false;
    }
  });
  return solved;
}

function unhighlightBlocks() {
  blankBlockSelected = false;
  blockSelected = false;
  selectedBlankBlock = null;
  selectedBlock = null;
  blocks.forEach((block) => {
    block.selected = false;
  });
  blankBlocks.forEach((blankBlock) => {
    blankBlock.selected = false;
  });
  drawBlocks();
}

function shuffle(inputString) {
  let string = inputString;
  var output = "";
  string = string.split("");
  while (string.length > 0) {
    output += string.splice((string.length * Math.random()) << 0, 1);
  }
  let outputWithoutSpace = output.replace(/ /g, "");
  return outputWithoutSpace;
}

function generatePuzzle(inputMessage) {
  len = inputMessage.length;
  let xVal = 10;
  let yVal = 10;
  var shuffled = shuffle(inputMessage);
  let numRows = Math.ceil(len / maxRowLen);
  if (len < maxRowLen) {
    blocksPerRow = len;
  } else {
    blocksPerRow = maxRowLen;
  }

  let blocksRemaining = shuffled.length;
  let blockIndex = -1;

  while (blocksRemaining > 0) {
    for (let i = 1; i < len && blocksRemaining > 0; i++) {
      xVal = 10;
      i--;
      for (let j = 0; j < blocksPerRow && blocksRemaining > 0; j++) {
        blockIndex++;
        const block = new Block(xVal, yVal, shuffled.charAt(blockIndex), blockIndex);
        blocks.push(block);
        xVal = xVal + blockSize + 5;
        i++;
        blocksRemaining--;
      }
      yVal = yVal + (blockSize + 10);
    }
  }

  let blankBlocksRemaining = len;
  let blankBlockIndex = -1;

  while (blankBlocksRemaining > 0) {
    for (let i = 1; i < len && blankBlocksRemaining > 0; i++) {
      xVal = 10;
      i--;
      for (let j = 0; j < blocksPerRow && blankBlocksRemaining > 0; j++) {
        blankBlockIndex++;
        console.log("Generating empty block at " + blankBlockIndex + " with char " + inputMessage.charAt(blankBlockIndex));
        const blankBlock = new BlankBlock(xVal, yVal + blockSize + 5, inputMessage.charAt(blankBlockIndex), blankBlockIndex);
        blankBlocks.push(blankBlock);
        xVal = xVal + blockSize + 5;
        i++;
        blankBlocksRemaining--;
        console.log("Blocks remaining: " + blankBlocksRemaining);
      }
      yVal = yVal + (blockSize + 10);
    }
  }
  canvas.width = (blocksPerRow * (blockSize + 10));
  canvas.height = (2 * ((numRows) * (blockSize + 10) + 10));
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

