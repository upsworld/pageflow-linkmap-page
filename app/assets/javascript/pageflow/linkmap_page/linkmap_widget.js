(function($) {
  var markerMargin = 32;
  var smallSizeBreakpoint = 190;

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
      hoverAreas.linkmapAreaVisited();
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

      hoverArea.toggleClass('portrait', hoverArea.width() <= hoverArea.height());
      hoverArea.toggleClass('landscape', hoverArea.width() > hoverArea.height());
      hoverArea.toggleClass('small', hoverArea.width() <= smallSizeBreakpoint ||
                            hoverArea.height() <= smallSizeBreakpoint);

      if (hoverArea.width() <= hoverArea.height()) {
        linkmapMarker.css({
          'width': hoverArea.width() - markerMargin,
          'height': hoverArea.width() - markerMargin,
        });
      }
      else {
        linkmapMarker.css({
          'width': hoverArea.height() - markerMargin,
          'height': hoverArea.height() - markerMargin,
        });
      }
    });
  };

  $.fn.linkmapAreaVisited = function() {
    this.each(function() {
      var hoverArea = $(this);
      var visited =
        hoverArea.data('targetType') === 'page' &&
        pageflow.linkmapPage.visitedPages.indexOf(hoverArea.data('targetId')) >= 0;

      hoverArea.toggleClass('visited', visited);
    });
  };
}(jQuery));