var Pic = function (canvas) {
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');

  this.sourceImageCanvas  = document.createElement('canvas');
  this.sourceImageContext = this.sourceImageCanvas.getContext('2d');
};

Pic.prototype.setWidth = function (width) {
  this.canvas.width            = width;
  this.sourceImageCanvas.width = width;
};

Pic.prototype.setHeight = function (height) {
  this.canvas.height            = height;
  this.sourceImageCanvas.height = height;
};

Pic.prototype.setSourceImage = function (image) {
  this.image = image;
  this.context.drawImage(image, 0, 0);
  this.sourceImageContext.drawImage(image, 0, 0);
};

Pic.prototype.drawSourceImage = function () {
  this.context.drawImage(this.image, 0, 0);
};

Pic.prototype.getSourceImageData = function () {
  return this.sourceImageContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
};

Pic.prototype.drawImageData = function (imageData) {
  return this.context.putImageData(imageData, 0, 0);
};

Pic.prototype.removeCanvas = function () {
    this.canvas.parentNode.removeChild(this.canvas);
};

Pic.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

Pic.prototype.createTempImageData = function () {
  var tempCanvas  = document.createElement('canvas');
  var tempContext = tempCanvas.getContext('2d');
  return tempContext.createImageData(this.canvas.width, this.canvas.height);
};

