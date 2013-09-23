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
    $(event.currentTarget).closest('.control').toggleClass('open');
  });

  $toolbar.on('click', '.control-row', function(event) {
    var $control = $(event.currentTarget).closest('.control');
    var $toggle  = $control.find('.toggle-on');
    $toggle.toggleClass('active');
    if ($toggle.data('checked') === "true") {
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
    $target = $(event.target);
    $target.val($target.prop('defaultValue'));
    $target.trigger('change');
  });


  // Commands
  $toolbar.on('click', '.reset-button', function(event) {
    resetFilters();
  });

  var canvas = $('#canvas')[0];
  var pic    = new Pic(canvas);
  var img    = new Image();
  
  img.src = 'img/tester.jpg';
  img.onload = function(){
    pic.setWidth(img.width);
    pic.setHeight(img.height);
    pic.setSourceImage(img);
    pic.drawSourceImage();
  };


  Filters = {};
  
  Filters.brightness = function(imageData, adjust) {
    adjust     = Math.floor(255 * (adjust / 100));
    var pixels = imageData.data;

    for (var i = 0; i < pixels.length; i += 4) {
      pixels[i]   += adjust;
      pixels[i+1] += adjust;
      pixels[i+2] += adjust;
    }

    return imageData;
  };


  Filters.contrast = function(imageData, adjust) {
    adjust = (adjust + 100) / (100 - adjust);

    var pixels = imageData.data;
    for (var i = 0; i < pixels.length; i += 4) {
      pixels[i]   = (adjust * ((pixels[i] - 128) + 128));
      pixels[i+1] = (adjust * ((pixels[i+1] - 128) + 128));
      pixels[i+2] = (adjust * ((pixels[i+2] - 128) + 128));
    }

    return imageData;
  };


  Filters.saturation = function(imageData, adjust) {
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


  Filters.threshold = function(imageData, threshold) {
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


  Filters.invert = function(imageData) {
    var pixels = imageData.data;
    for (var i = 0; i < pixels.length; i += 4) {
      pixels[i]   = 255 - pixels[i];
      pixels[i+1] = 255 - pixels[i+1];
      pixels[i+2] = 255 - pixels[i+2];
    }

    return imageData;
  };


  function resize() {
    var winHeight = $window.height();
    var winWidth  = $window.width();
    $('#toolbar, #editor').height(winHeight);
    $('#editor').width(winWidth - 250);
  }

  function applyFilters() {
    var brightness = parseInt($toolbar.find('.brightness-slider').val(), 10);
    var contrast   = parseInt($toolbar.find('.contrast-slider').val(), 10);
    var saturation = parseInt($toolbar.find('.saturation-slider').val(), 10);
    var threshold  = parseInt($toolbar.find('.threshold-slider').val(), 10);
    var invert     = $toolbar.find('.invert-checkbox').data('checked');
    
    var imageData  = pic.getSourceImageData();
    imageData = (brightness !== 0) ? Filters.brightness(imageData, brightness): imageData;
    imageData = (contrast !== 0) ? Filters.contrast(imageData, contrast): imageData;
    imageData = (saturation !== 0) ? Filters.saturation(imageData, saturation): imageData;
    imageData = (threshold !== 0) ? Filters.threshold(imageData, threshold): imageData;
    imageData = (invert === 'true') ? Filters.invert(imageData): imageData;
    pic.drawImageData(imageData);
  }

  function resetFilters() {
    $toolbar.find('.brightness-slider').val(0);
    $toolbar.find('.contrast-slider').val(0);
    $toolbar.find('.saturation-slider').val(0);
    $toolbar.find('.threshold-slider').val(0);
    $toolbar.find('.invert-checkbox')
      .data('checked', 'false')
      .removeClass('active');
    applyFilters();
  }

  resize();

});



