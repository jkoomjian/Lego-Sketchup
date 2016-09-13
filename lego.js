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
    let angle = calculateAngle(rect.right - rect.left, rect.bottom - rect.top);
    console.log("angle: " + angle);
    return (angle > 45) ? 'tb' : 'lr';
  }

  // Try to figure out which axis the user is moving the lego along
  // this is done by getting the angle of movement of the mouse,
  // the angles of the 3 axes, and returning the axis with the angle
  // closest to the mouse movement
  getAxisClosestsToMovement(eventX, eventY) {

    let mouseAngle = calculateAngle(eventX - this.lastClientX, eventY - this.lastClientY);
    let closest = [];

    //get the axis angles
    $$(".axis").forEach( axis => {
      let rect = axis.getBoundingClientRect()
      let angle = calculateAngle(rect.right - rect.left, rect.bottom - rect.top);
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
    var axis = this.isInitialDrag ? ['x','z'] : this.getAxisClosestsToMovement(eventX, eventY);

    //update last xy
    this.lastClientX = eventX;
    this.lastClientY = eventY;
    this.isInitialDrag = false;

    return axis;
  }
}

class Lego {

  constructor(sourceLegoPile, startClientX, startClientY) {
    this.zPlaneCell = 0;
    this.zPlaneRow = 0;
    this.zPlaneHeight = 0;

    this.mousePath = new MousePath(startClientX, startClientY);

    var legoTemplate = $("#lego-template")
    this.elem = document.importNode(legoTemplate.content, true).children[0];
    $(".plane-x").appendChild(this.elem);

    //set the color
    var color = sourceLegoPile.className.split(" ")[1]
    this.elem.className += " " + color;
  }

  getCell() {
    return $(`.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`);
  }

  drag(eventX, eventY) {
    //console.log("event: " + eventX + " " + eventY);
    var xPlaneRect = $(".plane-x").getBoundingClientRect();
    // console.log(`drag x:${eventX} y:${eventY} lego x:${this.elem.style.left} y:${this.elem.style.top}`);

    var styleProp, style;

    // can only move 1 dimension at a time!
    var axis = this.mousePath.onDragGetAxes(eventX, eventY);
    console.log(`axes to update: ${axis}`);

    // Z
    if (axis.includes('z')) {
      // yHieght = the height above the floor the lego is
      // adding yHeight to eventY will give the y coord as if the lego was on the plane
      // var yPlaneTop = $(`.plane-y .row-${this.zPlaneHeight}`).getBoundingClientRect().top;
      // var yPlaneBottom = $(`.plane-y .row-0`).getBoundingClientRect().top;
      // var yHeight =  Math.floor(yPlaneBottom - yPlaneTop);
      // var legoYxy; // y dimension in the xy plane (not the x plane the block rests on)
      // if (eventY + yHeight < xPlaneRect.top) {
      //   legoYxy = "9";
      // } else if (eventY + yHeight > xPlaneRect.bottom){
      //   legoYxy = "0";
      // } else {
      //   legoYxy = (eventY + yHeight - xPlaneRect.top) / (xPlaneRect.bottom - xPlaneRect.top);
      //   legoYxy = 9 - Math.floor(legoYxy * 10);
      // }

      let coord = this.getCoordForAxis('z', eventX, eventY, "top");
      this.zPlaneRow = 9 - coord;
      styleProp = "top";
      style = coord + "rem";
      console.log("coord: " + coord);
    }

    // X
    if (axis.includes('x')) {
      // var legoXxy;
      // if (eventX < xPlaneRect.left) {
      //   legoXxy = "0";
      // } else if (eventX > xPlaneRect.right){
      //   legoXxy = "9";
      // } else {
      //   legoXxy = (eventX - xPlaneRect.left) / (xPlaneRect.right - xPlaneRect.left);
      //   legoXxy = Math.floor(legoXxy * 10);
      // }

      let coord = this.getCoordForAxis('x', eventX, eventY, "left");

      this.zPlaneCell = coord;
      styleProp = "left";
      style = coord + "rem";
    }

    // Y
    if (axis.includes('y')) {
      var yPlaneRect = $(".plane-y").getBoundingClientRect();
      var xPlaneCell = $(`.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`);
      var xPlaneCellBottom = xPlaneCell.getBoundingClientRect().bottom;
      var yPlaneHeight = yPlaneRect.bottom - yPlaneRect.top;

      var legoZxy;
      if (eventY < xPlaneCellBottom - yPlaneHeight) {
        legoZxy = "9";
      } else if (eventY > xPlaneCellBottom){
        legoZxy = "0";
      } else {
        legoZxy = (xPlaneCellBottom - eventY) / yPlaneHeight;
        legoZxy = Math.floor(legoZxy * 10);
      }

      // console.log(`y axis: ${legoZxy} cellBottom: ${xPlaneCellBottom} eventY: ${eventY}`);
      this.zPlaneHeight = legoZxy;
      styleProp = "transform";
      style = `translateZ(${legoZxy * -1}rem)`;
    }

    // console.log(`coords: ${this.zPlaneCell}, ${this.zPlaneRow}`);
    if (this.isCollision()) {
      console.log("collision!");
    } else {
      this.elem.style[styleProp] = style;
      $$('.plane-x .cell.active').forEach( cell => {cell.className = cell.className.replace("active", "");});
      $(`.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`).className += " active";
    }
  }

  // Given the axis and mouse pos., get the coordinate the lego should be placed at for the given axis
  getCoordForAxis(axis, eventXScreen, eventYScreen, positioningProperty) {
    // vars ending in Screen are on the screen (xy) coordinate system
    // vars ending in Plane are along the plane's coordinate system
    var startEdgeScreen, endEdgeScreen, mousePosScreen,startEdgePositioning;
    // var planeRectScreen = $(`.plane-${axis}`).getBoundingClientRect();
    var xPlaneRectScreen = $(`.plane-x`).getBoundingClientRect();
    var orientation = MousePath.getAxisOrientation(axis);
    console.log("orientation: " + orientation);

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
      // awesome!
      [startEdgePlane, endEdgePlane] = [endEdgePlane, startEdgePlane];
    }

    // width of the axis on the plane, on the screen (in the given orienataion)
    var planeWidthScreen = endEdgeScreen - startEdgeScreen;
    var mouseDistFromStartEdgeScreen = mousePosScreen - startEdgeScreen;
    var coordOnAxis;
    if (mousePosScreen < startEdgeScreen) {
      coordOnAxis = startEdgePlane;
    } else if (mousePosScreen > endEdgeScreen){
      coordOnAxis = endEdgePlane;
    } else {
      coordOnAxis = mouseDistFromStartEdgeScreen / planeWidthScreen;
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

  place() {
    try {
      var landingCell = this.getCell();
      var currStackSize = landingCell['currStackSize'] || 0;

      landingCell['currStackSize'] = currStackSize + 1;
      lego.elem.style.transform = `translateZ(${currStackSize * -1}rem)`;

      this.elem.legoObj = this;
      this.elem.addEventListener("dragstart", onDragStartExistingLego);
      this.elem.addEventListener("drag", onDrag);
      this.elem.addEventListener("dragend", onDragEnd);
    } catch(ex) {
      console.log("looing for " + `.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`);
      consoel.err(ex);
    }
  }

  unplace() {
    var landingCell = this.getCell();
    if (landingCell['currStackSize']) {
      landingCell['currStackSize'] = landingCell['currStackSize'] - 1;
    }
  }

  isCollision() {
    var landingCell = this.getCell();
    var currStackSize = landingCell['currStackSize'] || 0;
    return (currStackSize > this.zPlaneHeight);
  }

}