
// Setup the drag and drop behavior if supported
  if (Modernizr.draganddrop && !!window.FileReader) {

    $('#drag-drop').show();
    var $dropZone = $('#drop-zone');
    var handleDragEnter = function(event){
      $dropZone.addClass('dragging');
      return false;
    };
    var handleDragLeave = function(event){
      $dropZone.removeClass('dragging');
      return false;
    };
    var handleDragOver = function(event){
      return false;
    };
    var handleDrop = function(event){
      $dropZone.removeClass('dragging');
      handleFiles(event.originalEvent.dataTransfer.files);
      return false;
    };
    $dropZone
      .on('dragenter', handleDragEnter)
      .on('dragleave', handleDragLeave)
      .on('dragover', handleDragOver)
      .on('drop', handleDrop);
  }

  function handleFiles(files) {
    var $draggedImages = $('#dragged-images');
    var imageType      = /image.*/;
    var fileCount      = files.length;

    for (var i = 0; i < fileCount; i++) {
      var file = files[i];

      if (file.type.match(imageType)) {
        var reader = new FileReader();
        reader.onload = function(event) {
            imageInfo = { images: [
                {'class': 'dropped-image', file: event.target.result}
              ]};

            var imageSectionHTML = Mustache.to_html($('#image-section-template').html(), imageInfo);
            $draggedImages.prepend(imageSectionHTML);

            var $imageSection = $draggedImages.find('.image-section').first();
            var $image        = $('.dropped-image .target-image');

            // Must wait for image to load in DOM, not just load from FileReader
            $image.on('load', function() {
              showColorsForImage($image, $imageSection);
            });
          };
        reader.readAsDataURL(file);
      } else {
        alert('File must be a supported image type.');
      }
    }
  }

