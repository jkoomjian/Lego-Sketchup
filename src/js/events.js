var ctrlKeyDown = false;
var shiftKeyDown = false;
var mouseBtnDown = false;
var mouseMiddleBtnDown = false;
var lastMouseCoords = [];


//---------- Pointer State ------------

function updatePointerState() {
  if (ctrlKeyDown || shiftKeyDown) {

    if (mouseBtnDown) {
      Utils.setPrefixedCursorStyle("grabbing");
    } else {
      Utils.setPrefixedCursorStyle("grab");
    }

  } else if (mouseMiddleBtnDown) {
    Utils.setPrefixedCursorStyle("grabbing");
  } else {
    // default
    document.body.style.cursor = "default";
  }
}

//---------- Key events ------------
function keyDown(event) {
  // console.log("keyCode: " + event.keyCode);
  switch(event.keyCode) {
    case 17:
      ctrlKeyDown = true
      break;
    case 16:
      shiftKeyDown = true;
      break;
    case 187: //+
      legoSpace.zoom(120);
      break;
    case 189: //-
      legoSpace.zoom(-120);
      break;
  }

  updatePointerState();
}

function keyUp(event) {
  if (event.keyCode === 17) ctrlKeyDown = false;
  if (event.keyCode == 16) shiftKeyDown = false;
  updatePointerState();
}

function mouseDown(event) {
  if (event.button === 0) mouseBtnDown = true;
  if (event.button === 1) mouseMiddleBtnDown = true;
  if (ctrlKeyDown || shiftKeyDown || mouseMiddleBtnDown) {
    lastMouseCoords = [event.clientX, event.clientY];
    event.preventDefault();
    updatePointerState();
  }
}

function mouseUp(event) {
  mouseBtnDown = false;
  mouseMiddleBtnDown = false;
  if (ctrlKeyDown || shiftKeyDown || event.button === 1) {
    updatePointerState();
    event.preventDefault();
  }
}

function mouseMove(event) {
  var action;
  // orbit
  if ((ctrlKeyDown && mouseBtnDown) || mouseMiddleBtnDown) action = legoSpace.orbit;
  // pan
  if (shiftKeyDown && mouseBtnDown) action = legoSpace.pan;

  if (action) {
    var currMouseCoords = [event.clientX, event.clientY];
    Utils.executeOnGreatEnoughChange(event.clientX, event.clientY, 10, 'mouseMove', function() {
      action(lastMouseCoords, currMouseCoords);
      lastMouseCoords = currMouseCoords;
    });
    event.preventDefault();
  }
}

function wheelMove(event) {
  legoSpace.zoom(event.wheelDelta);
  event.preventDefault();
}

function onMouseOver(event) {
  event.target.style.backgroundColor = "yellow";
}

//---------- Assign Event Handlers ------------
function initEventHandlers() {
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);
  window.addEventListener("mousemove", mouseMove);
  $("#lego-space").addEventListener("wheel", wheelMove);
  initializeDrag();
  // Utils.addHandlers(".plane-x .cell", "mouseover", onMouseOver);
}