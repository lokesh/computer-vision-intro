$(document).ready(function() {

  // Cache jQuery objects  
  var $window  = $(window);
  var $toolbar = $('#toolbar');


  // ----------------
  // Attach UI events
  // ----------------
  $(window).on('resize', function(event) {
    resize();
  });

  // Filters
  $toolbar.on('click', '.control-heading', function(event) {
    event.preventDefault();
    $(event.currentTarget).closest('.control').toggleClass('open');
  });

  $toolbar.on('click', '.control-row', function(event) {
    event.preventDefault();
    var $control = $(event.currentTarget).closest('.control');
    var $toggle  = $control.find('.toggle-on');
    $toggle.toggleClass('active');
    if ($toggle.data('checked') === 'true') {
      $toggle.data('checked', 'false');
    } else {
      $toggle.data('checked', 'true');
    }
    applyFilters();
  });

  $toolbar.on('change', '.horizontal-range', function(event) {
    applyFilters();
  });

  $toolbar.on('dblclick', '.horizontal-range', function(event) {
    event.preventDefault();
    $target = $(event.target);
    $target.val($target.prop('defaultValue'));
    $target.trigger('change');
  });

  // Commands
  $toolbar.on('click', '.blob-button', function(event) {
    event.preventDefault();
    countBlobs();
  });

  $toolbar.on('click', '.reset-button', function(event) {
    event.preventDefault();
    resetFilters();
  });


  // ----------
  // Init 
  // ----------

  var canvas  = $('#canvas')[0];
  var pic     = new Pic(canvas);
  var filters = new Filters(pic);
  var img     = new Image();
  
  // img.src = 'img/beetle.jpg';
  img.src = 'img/handwriting.jpg';
  // img.src = 'img/nissan.jpg';
  // img.src = 'img/pt.jpg';
  
  img.onload = function(){
    pic.setWidth(img.width);
    pic.setHeight(img.height);
    pic.setSourceImage(img);
    pic.drawSourceImage();
  };


  // --------------
  // Misc functions 
  // --------------

  function resize() {
    var winHeight = $window.height();
    var winWidth  = $window.width();
    $('#toolbar, #editor').css('height', winHeight + 'px');
    $('#editor').css('width', (winWidth - 250) + 'px');
  }

  function applyFilters() {
    var brightness = parseInt($toolbar.find('.brightness-slider').val(), 10);
    var contrast   = parseInt($toolbar.find('.contrast-slider').val(), 10);
    var saturation = parseInt($toolbar.find('.saturation-slider').val(), 10);
    var blur       = parseInt($toolbar.find('.blur-slider').val(), 10);
    var sharpen    = parseInt($toolbar.find('.sharpen-slider').val(), 10);
    var threshold  = parseInt($toolbar.find('.threshold-slider').val(), 10);
    var invert     = $toolbar.find('.invert-checkbox').data('checked');
    var edges      = $toolbar.find('.edges-checkbox').data('checked');

    var imageData  = pic.getSourceImageData();
    imageData = (brightness !== 0) ? filters.brightness(imageData, brightness): imageData;
    imageData = (contrast !== 0) ? filters.contrast(imageData, contrast): imageData;
    imageData = (saturation !== 0) ? filters.saturation(imageData, saturation): imageData;
    imageData = (blur !== 0) ? filters.blur(imageData, blur): imageData;
    imageData = (sharpen !== 0) ? filters.sharpen(imageData, sharpen): imageData;
    imageData = (threshold !== 0) ? filters.threshold(imageData, threshold): imageData;
    imageData = (invert === 'true') ? filters.invert(imageData): imageData;
    imageData = (edges === 'true') ? filters.edges(imageData): imageData;
    pic.drawImageData(imageData);
  }

  function resetFilters() {
    $toolbar.find('.control').removeClass('open');
    $toolbar.find('.horizontal-range').val(0);
    $toolbar.find('.toggle-on')
      .data('checked', 'false')
      .removeClass('active');

    applyFilters();
  }

  function countBlobs() {
    var imageData = pic.getImageData();
    var pixels    = imageData.data;
    var width     = imageData.width;
    var height    = imageData.height;

    var offset;

    
    var blobCount = 0;
    var blobs     = [];
    // for (var i = 0; i < pixels.length; i += 4) {
    //   if (pixels[i] + pixels[i + 1] +  pixels[i + 2] >=765) {
    //     // Is it the first pixel?
    //     if (i === 0) {
    //       blobCount++;
    //       blobs[0] = blobCount;
    //     } else if (i % (width * 4) === 0) { // Is pixel in first column?
          
    //     } else if (i < (width * 4)) { // Is pixel in first row?
          
    //     }
    //   } else {
    //     // blobs[]
    //   }
    // }
    // debugger;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        offset = ((y * width) + x) * 4;
        if (pixels[offset] + pixels[offset + 1] +  pixels[offset + 2] >=765) {
          if (x === 0 && y === 0) {
            blobCount++;
            console.log(blobs);
            blobs[(y * width) + x] = blobCount;
          } else if (x === 0) { // Is pixel in first column?
            if (blobs[((y - 1) * width) + x] > 0) {
              blobs[(y * width) + x] = blobs[((y - 1) * width) + x];
            } else {
              blobCount++;
              blobs[(y * width) + x] = blobCount;
            }
          } else if (y === 0) { // Is pixel in first row?
            if (blobs[(y * width) + x - 1] > 0) {
              blobs[(y * width) + x] = blobs[(y * width) + x - 1];
            } else {
              blobCount++;
              blobs[(y * width) + x] = blobCount;
            }
          } else {
            // if (blobs[x - 1][y] > 0) {
          }
        }
      }
    }
    console.log(blobCount);
    pic.drawImageData(imageData);
  }

  resize();

});



