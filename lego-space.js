class LegoSpace {
  constructor() {
    this.elem = $("#lego-space");
    var w = this.elem.offsetWidth;
    var y = this.elem.offsetHeight;

    // Transform styles are set here so they can be modified from this.elem.style.transform
    this.elem.style.transform = "rotateX(-10deg) rotateY(-3deg)";
  }
}
