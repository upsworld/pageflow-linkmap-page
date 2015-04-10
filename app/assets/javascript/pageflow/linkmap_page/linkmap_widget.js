(function($) {
  $.widget('pageflow.linkmap', {
    _create: function() {
      this.refresh();
    },

    refresh: function() {
      var hoverAreas = this.element.find('.hover_area'),
          hoverImages = this.element.find('.background_image'),
          baseImage = this.options.baseImage();

      hoverImages
        .width(baseImage.width())
        .height(baseImage.height());

      hoverImages.linkmapAreaImage();

      hoverAreas.linkmapAreaFormat();
    },
  });

  $.fn.linkmapAreaImage = function(optionalPosition) {
    this.each(function() {
      var hoverImage = $(this);
      var position = optionalPosition || hoverImage.parent().position();

      hoverImage.css({
        left: -position.left + 'px',
        top: -position.top + 'px'
      });
    });
  };

  $.fn.linkmapAreaFormat = function() {
    this.each(function() {
      var hoverArea = $(this);
      var linkmapMarker = hoverArea.find('.linkmap_marker');
      var margin = 32;

      hoverArea.toggleClass('portrait', hoverArea.width() <= hoverArea.height());
      hoverArea.toggleClass('landscape', hoverArea.width() > hoverArea.height());

      if(hoverArea.width() <= hoverArea.height()) {
        linkmapMarker.css({
          'width':hoverArea.width() - margin,
          'height':hoverArea.width() - margin,
        });
      }
      else {
        linkmapMarker.css({
          'width':hoverArea.height() - margin,
          'height':hoverArea.height() - margin,
        });
      }
    });
  };
}(jQuery));