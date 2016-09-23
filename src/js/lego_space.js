class LegoSpace {
  constructor() {
    this.elem = $("#lego-space");
    this.xPlane;
    this.yPlane;
    this.zPlane;

    // Transform styles are set here so they can be modified from this.elem.style.transform
    this.elem.style.transform = "rotateX(-10deg) rotateY(-3deg)";
  }

  // Rotate the lego space
  orbit(startCoords, endCoords) {
    var t = new Transform( $("#lego-space").style.transform );
    var magicNumber = .2;  //how much should the axis rotate for a given distance mouse movement
    var existingDegX = t.getPropValueInDegree("rotateX");
    var existingDegY = t.getPropValueInDegree("rotateY");
    var xDeg = Math.round((endCoords[0] - startCoords[0]) * magicNumber) + existingDegY;
    var yDeg = Math.round((endCoords[1] - startCoords[1]) * -1 * magicNumber) + existingDegX;
    t.transform["rotateX"] = yDeg + "deg";
    t.transform["rotateY"] = xDeg + "deg";
    $("#lego-space").style.transform = t.toString();
  }

  pan(startCoords, endCoords) {
    var t = new Transform( $("#lego-space").style.transform );
    var magicNumber = 1;
    var translateY = parseInt(t.transform.translateY || 0, 10);
    var translateX = parseInt(t.transform.translateX || 0, 10);
    var xDist = Math.round((endCoords[0] - startCoords[0]) * magicNumber) + translateX;
    var yDist = Math.round((endCoords[1] - startCoords[1]) * magicNumber) + translateY;
    t.transform["translateX"] = xDist + "px";
    t.transform["translateY"] = yDist + "px";
    $("#lego-space").style.transform = t.toString();
  }

  zoom(zoomAmt){
    zoomAmt = zoomAmt < 0 ? -120 : 120;
    var t = new Transform($("#lego-space").style.transform)
    var magicNumber = .001; //amount to increase scale by
    var baseScale = 1;

    if (t.transform["scale3d"]){
      baseScale = t.transform["scale3d"];
      baseScale = baseScale.split(",")[0].trim();
      baseScale = parseFloat(baseScale);
    }

    var newScale = (magicNumber * zoomAmt) + baseScale;
    t.transform["scale3d"] = `${newScale}, ${newScale}, ${newScale}`;
    $("#lego-space").style.transform = t.toString();
  }

}