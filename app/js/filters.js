var Filters = function(pic) {
  this.pic = pic;
};

Filters.prototype.convolute = function(imageData, weights) {
  var side         = Math.round(Math.sqrt(weights.length));
  var halfSide     = Math.floor(side/2);
  var pixels       = imageData.data;
  var width        = imageData.width;
  var height       = imageData.height;
  var newImageData = this.pic.createTempImageData();
  var newPixels    = newImageData.data;

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {

      // Calculate the weighed sum of the source image pixels that
      // fall under the convolution matrix.
      var r = 0, g = 0, b = 0, a = 0;
      for (var filterY = 0; filterY < side; filterY++) {
        for (var filterX = 0; filterX < side; filterX++) {
          var pixelY = y + filterY - halfSide;
          var pixelX = x + filterX - halfSide;
          if (pixelY >= 0 && pixelY < height && pixelX >= 0 && pixelX < width) {
            var pixelOffset = (pixelY * width + pixelX) * 4;
            var weight = weights[filterY * side + filterX];
            r += pixels[pixelOffset] * weight;
            g += pixels[pixelOffset + 1] * weight;
            b += pixels[pixelOffset + 2] * weight;
            a += pixels[pixelOffset + 3] * weight;
          }
        }
      }
      var newOffset            = (y * width + x) * 4;
      newPixels[newOffset]     = r;
      newPixels[newOffset + 1] = g;
      newPixels[newOffset + 2] = b;
      newPixels[newOffset + 3] = a;
    }
  }
  return newImageData;
};


Filters.prototype.brightness = function(imageData, adjust) {
  adjust     = Math.floor(255 * (adjust / 100));
  var pixels = imageData.data;

  for (var i = 0; i < pixels.length; i += 4) {
    pixels[i]   += adjust;
    pixels[i+1] += adjust;
    pixels[i+2] += adjust;
  }

  return imageData;
};


Filters.prototype.contrast = function(imageData, adjust) {
  adjust = (adjust + 100) / (100 - adjust);

  var pixels = imageData.data;
  for (var i = 0; i < pixels.length; i += 4) {
    pixels[i]   = (adjust * ((pixels[i] - 128) + 128));
    pixels[i+1] = (adjust * ((pixels[i+1] - 128) + 128));
    pixels[i+2] = (adjust * ((pixels[i+2] - 128) + 128));
  }

  return imageData;
};


Filters.prototype.saturation = function(imageData, adjust) {
  adjust *= -0.01;
  var pixels = imageData.data;
  var max;

  for (var i = 0; i < pixels.length; i += 4) {
    max = Math.max(pixels[i], pixels[i+1], pixels[i+2]);
    pixels[i]   += (max - pixels[i]) * adjust;
    pixels[i+1] += (max - pixels[i+1]) * adjust;
    pixels[i+2] += (max - pixels[i+2]) * adjust;
  }

  return imageData;
};


Filters.prototype.blur = function(imageData, blur) {
  for (var i = 0; i <= blur; i++) {
    imageData = this.convolute(imageData,
     [   0, 0.2,   0,
       0.2, 0.2, 0.2,
         0, 0.2,   0]);
  }
  return imageData;
};

Filters.prototype.sharpen = function(imageData, sharpen) {
  for (var i = 0; i <= sharpen; i++) {
    imageData = this.convolute(imageData,
     [     0, -0.05,     0,
       -0.05,   1.2, -0.05,
           0, -0.05,     0]);
  }
  return imageData;
};

Filters.prototype.edges = function(imageData) {
  var imageDataCopy = jQuery.extend(true, {}, imageData);
  imageDataCopy = this.convolute(imageDataCopy,
    [  -4,  -4,  -4,
       -4,  32,  -4,
       -4,  -4,  -4]);

  imageDataCopy = this.threshold(imageDataCopy, 150);
  var pixels     = imageData.data;
  var pixelsCopy = imageDataCopy.data;
  for (var i = 0; i < pixelsCopy.length; i += 4) {
    if ((pixelsCopy[i] + pixelsCopy[i+1] + pixelsCopy[i+2]) >= 765) {
      pixels[i]   = 255;
      pixels[i+1] = 124;
      pixels[i+2] = 79;
    } else {
      pixels[i+3] = 0;
    }
  }
  return imageData;
};

Filters.prototype.threshold = function(imageData, threshold) {
  var pixels = imageData.data;
  for (var i = 0; i < pixels.length; i += 4) {
    if (((pixels[i] + pixels[i+1] + pixels[i+2]) / 3) > threshold) {
      pixels[i] = pixels[i+1] = pixels[i+2] = 255;
    } else {
      pixels[i] = pixels[i+1] = pixels[i+2] = 0;
    }
  }

  return imageData;
};


Filters.prototype.invert = function(imageData) {
  var pixels = imageData.data;
  for (var i = 0; i < pixels.length; i += 4) {
    pixels[i]   = 255 - pixels[i];
    pixels[i+1] = 255 - pixels[i+1];
    pixels[i+2] = 255 - pixels[i+2];
  }

  return imageData;
};
