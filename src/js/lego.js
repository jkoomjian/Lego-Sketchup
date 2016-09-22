class Lego {

  constructor(sourceLegoPile, startClientX, startClientY) {
    this.xPlaneRow = 0;
    this.xPlaneCell = 0;
    this.xPlaneHeight = 0;

    this.offsetY = 0;
    this.mousePath = new MousePath(startClientX, startClientY);

    var legoTemplate = $("#lego-template")
    this.elem = document.importNode(legoTemplate.content, true).children[0];
    $(".plane-x").appendChild(this.elem);

    //set the color
    this.elem.classList.add( sourceLegoPile.classList[1] );
  }

  getCell() {
    return $(`.plane-x .row-${this.xPlaneRow} .cell-${this.xPlaneCell}`);
  }

  drag(eventX, eventY) {
    eventY += this.offsetY;

    var that = this;
    function updateLocation(styleProp, styleVal, coord) {
      if (that.isCollision()) {
        console.log("collision!");
      } else {
        that.elem.style[styleProp] = styleVal;
        $$('.plane-x .cell.active').forEach( cell => {cell.classList.remove("active");});
        that.getCell().classList.add("active");
        console.log(`drag ${coord}rem ${styleProp}`);
      }
    }

    //console.log("event: " + eventX + " " + eventY);
    var xPlaneRect = $(".plane-x").getBoundingClientRect();
    // console.log(`drag x:${eventX} y:${eventY} lego x:${this.elem.style.left} y:${this.elem.style.top}`);

    var styleProp, style, coord;

    // can only move [y] or [x,z] dimensions at a time!
    var axis = this.mousePath.onDragGetAxes(eventX, eventY);
    // console.log(`axes to update: ${axis}`);

    // Z
    if (axis.includes('z')) {
      try {
        coord = this.mousePath.getCoordForAxis2('z', eventX, eventY, "top", this.getYHeight());
        this.xPlaneRow = 9 - coord;
        updateLocation("top", coord + "rem", coord);
      } catch(ex) {
        return;
      }
    }

    // X
    if (axis.includes('x')) {
      try {
        coord = this.mousePath.getCoordForAxis2('x', eventX, eventY, "left", this.getYHeight());
        this.xPlaneCell = coord;
        updateLocation("left", coord + "rem", coord);
      } catch(ex) {
        return;
      }
    }

    // Y //TODO update this to use getCoordForAxis
    if (axis.includes('y')) {
      var yPlaneRect = $(".plane-y").getBoundingClientRect();
      var xPlaneCell = this.getCell();
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
      this.xPlaneHeight = legoZxy;
      updateLocation("transform", `translateZ(${legoZxy * -1}rem)`, legoZxy * -1);
    }

    // console.log(`coords: ${this.xPlaneCell}, ${this.xPlaneRow}`);
  }

  //return the height of this lego, in px, above the x plane
  getYHeight() {
    var yPlaneRect = $(".plane-y").getBoundingClientRect();
    var yPlaneHeight = yPlaneRect.bottom - yPlaneRect.top;
    return this.xPlaneHeight * .1 * yPlaneHeight;
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
      console.log("looing for " + `.plane-x .row-${this.xPlaneRow} .cell-${this.xPlaneCell}`);
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
    return (currStackSize > this.xPlaneHeight);
  }

}