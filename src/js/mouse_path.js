// Responsible for determining the axis the mouse is moving along
class MousePath {

  constructor(startClientX, startClientY) {
    this.lastClientX = startClientX;
    this.lastClientY = startClientY;
    this.isInitialDrag = true;
  }

  // returns lr or tb, depending if the orientation is primarily left-right or up-down
  static getAxisOrientation(axis) {
    var axisElem = $(`.axis-${axis}`);
    let rect = axisElem.getBoundingClientRect();
    let angle = Utils.calculateAngle(rect.right - rect.left, rect.bottom - rect.top);
    console.log("angle: " + angle);
    return (angle > 45) ? 'tb' : 'lr';
  }

  // Try to figure out which axis the user is moving the lego along
  // this is done by getting the angle of movement of the mouse,
  // the angles of the 3 axes, and returning the axis with the angle
  // closest to the mouse movement
  getAxisClosestsToMovement(eventX, eventY) {

    let mouseAngle = Utils.calculateAngle(eventX - this.lastClientX, eventY - this.lastClientY);
    let closest = [];

    //get the axis angles
    $$(".axis").forEach( axis => {
      let rect = axis.getBoundingClientRect()
      let angle = Utils.calculateAngle(rect.right - rect.left, rect.bottom - rect.top);
      let axisName = axis.className.match(/axis-([xyz])/i)[1];
      // console.log(`axis: ${axisName} angle: ${angle} top: ${rect.top} bottom: ${rect.bottom} left: ${rect.left} right: ${rect.right}`);
      closest.push([axisName, angle, Math.abs(mouseAngle - angle)]);
    });

    closest.sort( (a, b) => {
      return a[2] - b[2];
    });

    // var log = `mouse angle: ${mouseAngle} -> ${Math.abs(eventX - this.lastClientX)} x ${Math.abs(eventY - this.lastClientY)}\n`;
    // closest.forEach( e => {log += `${e[0]}: ${e[1]}\n`});
    // console.log(log);

    return closest.map( ar => {return ar[0]})[0];
  }

  onDragGetAxes(eventX, eventY) {
    var axis = this.getAxisClosestsToMovement(eventX, eventY);
    //x,z can be updated at the same time
    //y only updated by itself for now
    if (axis[0] == 'y' && !this.isInitialDrag) {
      axis = ['y'];
    } else {
      axis = ['x','z']
    }

    //update last xy
    this.lastClientX = eventX;
    this.lastClientY = eventY;
    this.isInitialDrag = false;

    return axis;
  }

  getCoordForAxis2(axis, eventXScreen, eventYScreen, positioningProperty) {
    var startCellPlane, endCellPlane, startEdgePositioning;
    console.log("axis: " + axis);

    // Get the cells at the start and end of the line the lego is moving along
    if (axis == "z") {
      startCellPlane = $(`.plane-x .row-0 .cell-${this.xPlaneCell}`);
      endCellPlane = $(`.plane-x .row-9 .cell-${this.xPlaneCell}`);
    } else {
      startCellPlane = $(`.plane-x .row-${this.xPlaneRow} .cell-0`);
      endCellPlane = $(`.plane-x .row-${this.xPlaneRow} .cell-9`);
    }

    var orientation = MousePath.getAxisOrientation(axis);
    startEdgePositioning = orientation == 'lr' ? 'left' : 'top';

    // Calculate the distance of the line, from start to finish
    var startCellRect = startCellPlane.getBoundingClientRect();
    var endCellRect = endCellPlane.getBoundingClientRect();
    //assumes plane is not rotated 180deg
    var totalLineDist = Utils.calcDistance(startCellRect.left, startCellRect.top, endCellRect.right, endCellRect.bottom)

    // Calculate distance between end and mouse coords
    var partialLineDist = Utils.calcDistance(eventXScreen, eventYScreen, startCellRect.left, startCellRect.top);
    var coordDist = partialLineDist / totalLineDist;
    coordDist = Math.floor(coordDist * 10);

    if (coordDist < 0) coordDist = 0;
    if (coordDist > 9) coordDist = 9;

    var reverse = this._shouldReverse('.plane-x', startCellRect[startEdgePositioning], startEdgePositioning, positioningProperty)
    if (reverse) coordDist = 9 - coordDist;

    return coordDist;
    // if (mousePosScreen + yHeight < startEdgeScreen) {
    //   coordOnAxis = startEdgePlane;
    // } else if (mousePosScreen + yHeight > endEdgeScreen){
    //   coordOnAxis = endEdgePlane;
    // } else {
    //   coordOnAxis = (mouseDistFromStartEdgeScreen + yHeight) / planeWidthScreen;
    //   coordOnAxis = Math.floor(coordOnAxis * 10);
    //   if (reverse) coordOnAxis = startEdgePlane - coordOnAxis;
    // }

  }

  // Given the axis and mouse pos., get the coordinate the lego should be placed at for the given axis
  getCoordForAxis(axis, eventXScreen, eventYScreen, positioningProperty) {
    // vars ending in Screen are on the screen (xy) coordinate system
    // vars ending in Plane are along the plane's coordinate system
    var startEdgeScreen, endEdgeScreen, mousePosScreen,startEdgePositioning;
    // var planeRectScreen = $(`.plane-${axis}`).getBoundingClientRect();
    var xPlaneRectScreen = $(`.plane-x`).getBoundingClientRect();
    var orientation = MousePath.getAxisOrientation(axis);
    console.log("orientation: " + orientation + " eventX: " + eventXScreen + " eventY: " + eventYScreen);

    // yHieght = the height above the floor the lego is
    // adding yHeight to eventY will give the y coord as if the lego was on the plane
    // TODO this is probably broken
    var yHeight = 0;
    // if (axis == 'y' && orienataion == 'tb') {
    //   let yPlaneTop = $(`.plane-y .row-${this.xPlaneHeight}`).getBoundingClientRect().top;
    //   let yPlaneBottom = $(`.plane-y .row-0`).getBoundingClientRect().top;
    //   yHeight =  Math.floor(yPlaneBottom - yPlaneTop);
    // }

    if (orientation == 'lr') {
      startEdgeScreen = xPlaneRectScreen.left;
      endEdgeScreen = xPlaneRectScreen.right;
      mousePosScreen = eventXScreen;
      startEdgePositioning = 'left';
    } else {
      startEdgeScreen = xPlaneRectScreen.top;
      endEdgeScreen = xPlaneRectScreen.bottom;
      mousePosScreen = eventYScreen;
      startEdgePositioning = 'top';
    }

    var reverse = this._shouldReverse('.plane-x', startEdgeScreen, startEdgePositioning, positioningProperty)

    // If reverse, then 9 is the start coord, and 0 is the end coord
    var startEdgePlane = 0, endEdgePlane = 9;
    if (reverse) {
      [startEdgePlane, endEdgePlane] = [endEdgePlane, startEdgePlane];
    }

    // width of the axis on the plane, on the screen (in the given orienataion)
    var planeWidthScreen = endEdgeScreen - startEdgeScreen;
    var mouseDistFromStartEdgeScreen = mousePosScreen - startEdgeScreen;
    var coordOnAxis;
    if (mousePosScreen + yHeight < startEdgeScreen) {
      coordOnAxis = startEdgePlane;
    } else if (mousePosScreen + yHeight > endEdgeScreen){
      coordOnAxis = endEdgePlane;
    } else {
      coordOnAxis = (mouseDistFromStartEdgeScreen + yHeight) / planeWidthScreen;
      coordOnAxis = Math.floor(coordOnAxis * 10);
      if (reverse) coordOnAxis = startEdgePlane - coordOnAxis;
    }

    return coordOnAxis;
  }

  // When the coordinate plane start (top/left) and the startEdgeScreen are not on the same
  // the coordinates have to reversed (0 becomes 9, 9 becomes 0)
  // startEdge - px value of the startEdge
  // startEdgePos - the position property used (left or top)
  // positioningProperty - the style the plane uses to place the lego (top or left)
  _shouldReverse(planeId, startEdge, startEdgePos, positioningProperty) {
    // To figure out if startEdgeScreen is the same edge as the plane starting edge:
    var planeElem = $(planeId);

    // place a 1x100% div at the top of the plane (plane coords)
    var styles = {position: 'absolute', top: '0', left: '0'};
    if (positioningProperty == "top") {
      styles['height'] = '1px';
      styles['width'] = '100%';
    } else {
      styles['width'] = '1px';
      styles['height'] = '100%';
    }

    var div = document.createElement("div");
    div.css(styles);
    planeElem.appendChild(div);

    //getRect on the div (screen coords)
    var divRectScreen = div.getBoundingClientRect();

    //get the startEdgePos property of getRect
    var divStartEdge = divRectScreen[startEdgePos];

    //it should match startEdge - if within 50px probably the same edge
    var diff = Math.abs(divStartEdge - startEdge);
    div.remove();

    return diff > 50;
  }
}