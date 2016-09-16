window.addEventListener('load', function() {
  window.legoSpace = new LegoSpace();
  legoSpace.xPlane = new XPlane(legoSpace);
  legoSpace.yPlane = new YPlane(legoSpace);
  legoSpace.zPlane = new ZPlane(legoSpace);
  initEventHandlers();
});