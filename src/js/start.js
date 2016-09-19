window.addEventListener('load', function() {
  window.legoSpace = new LegoSpace();
  legoSpace.xPlane = new XPlane(legoSpace);
  legoSpace.yPlane = new YPlane(legoSpace);
  legoSpace.zPlane = new ZPlane(legoSpace);
  initEventHandlers();
  // runTest()
});

// Testing
function runTest() {
  var testLego = new Lego(document.querySelector(".lego-pile.red"), 0, 0);
  testLego.offsetY = 0;
  testLego.drag(374, 260);

  //X movement
  testLego.drag(444, 260);
  testLego.drag(514, 260);

  //Z Movement
  // lego.drag(704, 260);
}