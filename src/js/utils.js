class Utils {

  static repeatNTimes(n, callback) {
    for (let i=0; i<n; i++) callback(i);
  }

  static addHandlers(selector, eventType, eventHandler) {
    $$(selector).forEach( elem => {
      elem.addEventListener(eventType, eventHandler);
    });
  }


  /*------- Mouse ---------*/

  // Given a callback, and x, y coordinates, only execute the callback if the coordinates have changed
  // by more than minPointerDifference
  static executeOnGreatEnoughChange(x, y, minPointerDifference, name, callback) {

    if (!window['lastPointers']) {
      window.lastPointers = {};
    }

    var lastPointer = window.lastPointers[name];

    if (!lastPointer) {
      window.lastPointers[name] = [x, y];
      return callback(0);
    }

    var diff = Math.abs(x - lastPointer[0]) + Math.abs(y - lastPointer[1]);
    if (diff > minPointerDifference) {
      window.lastPointers[name] = [x, y];
      return callback(diff);
    }
  }

  static calcDistance(startX, startY, endX, endY) {
    var xDist = Math.abs(endX - startX);
    var yDist = Math.abs(endY - startY);
    return Math.floor(Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)));
  }

  // return the angle, between 0-90
  static calculateAngle(xDist, yDist) {
    const rad2deg = 180/Math.PI;
    var x = Math.abs(xDist);
    var y = Math.abs(yDist);
    var degrees = Math.atan( y / x) * rad2deg;
    return degrees % 90;
  }


  /*------- CSS ---------*/
  static setPrefixedStyle(styleProp, styleVal) {
    ['webkit', 'moz'].forEach( browserPrefix => document.body.style[styleProp] = `-${browserPrefix}-${styleVal}`);
  }

  static setPrefixedCursorStyle(styleVal) {
    Utils.setPrefixedStyle('cursor', styleVal);
  }

  static getOpposingPosition(position) {
    var opposingPositions = {top: "bottom", bottom: "top", left: "right", left: "right"};
    return opposingPositions[position];
  }

  static getAdjacentPosition(position) {
    var adjacentPositions = {top: "left", bottom: "left", left: "top", right: "top"};
    return adjacentPositions[position];
  }

  /*------- Screen ---------*/
  //returns the cell, cell id, row id
  static getCellAtCoords(eventXScreen, eventYScreen) {
    var currCell = document.elementFromPoint(eventXScreen, eventYScreen);

    if (!currCell) throw new Error("Unable to locate cell");

    //sometimes gets rows or legospace
    for(let i=0; i<10; i++) {
      if (!currCell.className.match(/cell/)) {
        eventYScreen -= (i * 5); // - some amount from y to avoid landing on the row border, or lego face
        currCell = document.elementFromPoint(eventXScreen, eventYScreen);
      } else {
        break;
      }
    }

    //verify a cell //would be better to use jquery's parents()
    if (!currCell.className.match(/cell/) || !currCell.parentNode.parentNode.className.match(/plane-x/)) {
      console.log("not at cell");
      console.dir(currCell);
      throw new Error("Unable to find cell");
    }

    // currCell.style.backgroundColor = "yellow";
    var xPlaneCell = currCell.className.match(/cell-(\d+)/)[1]
    var xPlaneRow = currCell.parentNode.className.match(/row-(\d+)/)[1]
    return [currCell, xPlaneCell, xPlaneRow];
  }

}