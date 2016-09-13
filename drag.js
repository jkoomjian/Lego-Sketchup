var lego;
function onDragStart(event) {
  console.log("start drag!");
  //create a new lego
  lego = new Lego(event.target, event.clientX, event.clientY)
  _onDragStartCommon(event);
}

function onDragStartExistingLego(event) {
  console.log("start drag w/existing lego!");
  lego = event.target.legoObj;
  lego.unplace();
  _onDragStartCommon(event);
}

function _onDragStartCommon(event) {
  event.dataTransfer.dropEffect = "copy";
  event.dataTransfer.setDragImage($("#empty"), 0, 0);
}

function onDrag(event) {
  executeOnGreatEnoughChange(event.clientX, event.clientY, 30, 'dragLego', function(mouseChangeAmount) {
    // At mouse end mouse coords go off to the side
    if (mouseChangeAmount < 200) {
      lego.drag(event.clientX, event.clientY);
    }
  });
}

function onDragEnd(event) {
  console.log("at drag end");
  lego.place();
}

function initializeDrag() {
  addHandlers(".lego-pile", "dragstart", onDragStart);
  addHandlers(".lego-pile", "drag", onDrag);
  addHandlers(".lego-pile", "dragend", onDragEnd);
}

