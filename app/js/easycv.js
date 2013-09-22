(function() {

  // Cache jQuery objects  
  var $window  = $(window);
  var $toolbar = $('#toolbar');

  function resize() {
    var winHeight = $window.height();
    var winWidth  = $window.width();
    $('#toolbar, #editor').height(winHeight);
    $('#editor').width(winWidth - 250);
  }

  resize();

  // Attach UI events
  $(window).on('resize', function(event) {
    resize();
  });

  $toolbar.on('click', '.control-heading', function(event) {
    $(event.currentTarget).closest('.control').toggleClass('open');
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

  function applyFilters() {
    var brightness = parseInt($toolbar.find('.brightness-slider').val(), 10);
    var contrast   = parseInt($toolbar.find('.contrast-slider').val(), 10);
    var saturation = parseInt($toolbar.find('.saturation-slider').val(), 10);

    var imageData  = pic.getSourceImageData();
    imageData = Filters.brightness(imageData, brightness);
    imageData = Filters.contrast(imageData, contrast);
    imageData = Filters.saturation(imageData, saturation);
    pic.drawImageData(imageData);
  }


  $toolbar.on('change', '.horizontal-range', function(event) {
    applyFilters();
  });

  $toolbar.on('dblclick', '.horizontal-range', function(event) {
    $target = $(event.target);
    $target.val($target.prop('defaultValue'));
    $target.trigger('change');
  });


}());



