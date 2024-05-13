const blockSize = 60;
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
      this.isSelectable = false;
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
  inputMessage = inputMessage.toUpperCase();
  const words = inputMessage.split(' ');
  wordsLen = words.length;

  let xVal = 10;
  let yVal = 10;

  let blankIndex = -1;
  let curLength = 0;
  let blocksPerRow = 0;
  let blocksTall = 1;

  words.forEach((element) => {
    let testLen = element.length;
    console.log(element);
    if(testLen >= blocksPerRow) {
      blocksPerRow = testLen;
    }

    if (curLength >= maxRowLen) {
      yVal = yVal + (blockSize + 10);
      xVal = 10;
      blocksPerRow = Math.max(blocksPerRow, curLength);
      curLength = 0;
      blocksTall++;
    }
    let wordLen = element.length;
    let curIndex = 0;
    while (wordLen > 0) {
      blankIndex++;
      const blankBlock = new BlankBlock(xVal, yVal, element.charAt(curIndex), blankIndex);
      blankBlocks.push(blankBlock);
      xVal = xVal + blockSize + 5;
      wordLen--;
      curIndex++;
      curLength++;
    }
    blocksPerRow = Math.max(blocksPerRow, curLength);

    console.log(curLength);
    blankIndex++;
    curLength++;
    xVal = xVal + blockSize + 5;
  });
 
  len = inputMessage.length;

  var shuffled = shuffle(inputMessage);
  let blocksRemaining = shuffled.length;
  let blockIndex = -1;
  yVal = yVal + (blockSize + 10);
  curLength = 0;

  for (let i = 1; i < len && blocksRemaining > 0; i++) {
      xVal = 10;
      for (let j = 0; j < blocksPerRow && blocksRemaining > 0; j++) {
        blockIndex++;
        const block = new Block(xVal, yVal + blockSize + 5, shuffled.charAt(blockIndex), blockIndex);
        blocks.push(block);
      xVal = xVal + blockSize + 5;
      i++;
      blocksRemaining--;
    }
    blocksTall++;
    yVal = yVal + (blockSize + 10);
  }

  console.log("Per Row: " + blocksPerRow);
  console.log("Tall: " + blocksTall);

  if (blocksPerRow % 2 == 1) {
    canvas.width = (blocksPerRow * (blockSize + 10));
  } else {
    canvas.width = (15 + (blocksPerRow * (blockSize + 5)));
  }
  canvas.height = ((blocksTall + 1) * (blockSize + 10));
  drawBlocks();
}

function displayMessage(score) {
  msg = document.getElementById("finalMessage");
  if (score == 0) {
    msg.innerHTML = "Great job!!!";
  } else {
    msg.innerHTML = "Try Again!";
  }
}
function copyLink(){
  var linkText = document.getElementById("linkText");
  let copiedLink = "http://localhost:8080/puzzle/" + linkText.value;
  navigator.clipboard.writeText(copiedLink);
}

generatePuzzle(submitted_message);

