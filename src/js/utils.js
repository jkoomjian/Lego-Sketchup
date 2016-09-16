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

}