window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

function repeatNTimes(n, callback) {
  for (let i=0; i<n; i++) callback(i);
}

HTMLElement.prototype.appendNChildren = function(numElems, className, reverseNumbering=false, callback) {
  repeatNTimes(numElems, (n) => {
    let div = document.createElement("div");
    div.className = `${className} ${className}-${ reverseNumbering ? numElems - 1 - n : n}`;
    this.appendChild(div);
    if (callback) callback(div, n);
  });
}

HTMLElement.prototype.css = function(map) {
  Object.keys(map).forEach( key => {
    this.style[key] = map[key];
  });
}

if (!Array.prototype['includes']) {
  Array.prototype.includes = function(e) {
    return this.indexOf(e) >= 0;
  }
}

function addHandlers(selector, eventType, eventHandler) {
  $$(selector).forEach( elem => {
    elem.addEventListener(eventType, eventHandler);
  });
}

// Given a callback, and x, y coordinates, only execute the callback if the coordinates have changed
// by more than minPointerDifference
var lastPointers = {};
function executeOnGreatEnoughChange(x, y, minPointerDifference, name, callback) {
  var lastPointer = lastPointers[name];

  if (!lastPointer) {
    lastPointers[name] = [x, y];
    return callback(0);
  }

  var diff = Math.abs(x - lastPointer[0]) + Math.abs(y - lastPointer[1]);
  if (diff > minPointerDifference) {
    lastPointers[name] = [x, y];
    return callback(diff);
  }
}

function calcDistance(startX, startY, endX, endY) {
  var xDist = Math.abs(endX - startX);
  var yDist = Math.abs(endY - startY);
  return Math.floor(Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)));
}

// return the angle, between 0-90
function calculateAngle(xDist, yDist) {
  const rad2deg = 180/Math.PI;
  var x = Math.abs(xDist);
  var y = Math.abs(yDist);
  var degrees = Math.atan( y / x) * rad2deg;
  return degrees % 90;
}