window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

if (!Array.prototype['includes']) {
  Array.prototype.includes = function(e) {
    return this.indexOf(e) >= 0;
  }
}

HTMLElement.prototype.appendNChildren = function(numElems, className, reverseNumbering=false, callback) {
  Utils.repeatNTimes(numElems, (n) => {
    let div = document.createElement("div");
    div.className = `${className} ${className}-${ reverseNumbering ? numElems - 1 - n : n}`;
    this.appendChild(div);
    if (callback) callback(div, n);
  });
}

HTMLElement.prototype.css = function(map) {
  Object.keys(map).forEach( key => {
    this.style[key] = map[key];
  });
}