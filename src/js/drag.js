var lego, currClientX, currClientY;

function onDragStart(event) {
  console.log("start drag!");
  //create a new lego
  lego = new Lego(event.target, event.clientX, event.clientY)
  _onDragStartCommon(event);
}

function onDragStartExistingLego(event) {
  console.log("start drag w/existing lego! ");
  lego = event.target.legoObj;
  lego.offsetY = event.offsetY;
  lego.unplace();
  _onDragStartCommon(event);
}

function _onDragStartCommon(event) {
  event.dataTransfer.setData('text/plain',null); //required for FF
  event.dataTransfer.dropEffect = "copy";
  event.dataTransfer.setDragImage($("#empty"), 0, 0);
}

function onDrag(event) {
  var clientX = event.clientX || currClientX || 0;
  var clientY = event.clientY || currClientY || 0;
  Utils.executeOnGreatEnoughChange(clientX, clientY, 30, 'dragLego', function(mouseChangeAmount) {
    // At mouse end mouse coords go off to the side
    if (mouseChangeAmount < 200) {
      //console.log(`at drag: x: ${clientX} y: ${clientY} yOffset: ${lego.offsetY}`);
      lego.drag(clientX, clientY);
    }
  });
}

function onDragEnd(event) {
  console.log("at drag end");
  lego.place();
}

function initializeDrag() {
  Utils.addHandlers(".lego-pile", "dragstart", onDragStart);
  Utils.addHandlers(".lego-pile", "drag", onDrag);
  Utils.addHandlers(".lego-pile", "dragend", onDragEnd);
  //Hack for FF
  document.addEventListener("dragover", function(event) {
    currClientX = event.clientX;
    currClientY = event.clientY;
  });
}

