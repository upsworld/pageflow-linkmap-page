(function($) {
  var markerMargin = 32;
  var smallSizeBreakpoint = 190;

  $.widget('pageflow.linkmap', {
    _create: function() {
      var widget = this;

      this.refresh();

      this.element.on('mouseenter', '.hover_area', function() {
        var hoverArea = $(this);

        if (widget.options.hoverVideoEnabled) {
          widget.options.hoverVideo.hide();

          if (!widget.hoverVideoParent) {
            widget.hoverVideoParent = widget.options.hoverVideo.parent();
          }

          widget.options.hoverVideo.appendTo(hoverArea);
          widget._resizeToBaseImage(widget.options.hoverVideo);
          hoverArea.linkmapAreaClip();

          var videoPlayer = widget.options.hoverVideo.data('videoPlayer');
          videoPlayer.play();

          widget.options.hoverVideo.show();
        }
      });

      this.element.on('mouseleave', '.hover_area', function() {
        if (widget.options.hoverVideoEnabled) {
          widget.options.hoverVideo.hide();

          var videoPlayer = widget.options.hoverVideo.data('videoPlayer');
          videoPlayer.currentTime(0);
          videoPlayer.pause();
        }
      });
    },

    updateHoverVideoEnabled: function(value) {
      if (!value && this.hoverVideoParent) {
        this.options.hoverVideo.prependTo(this.hoverVideoParent);

        this.options.hoverVideo.css({
          left: 'auto',
          top: 'auto',
          width: 'auto',
          height: 'auto'
        }).show();
      }

      this.options.hoverVideoEnabled = value;
    },

    refresh: function() {
      var hoverAreas = this.element.find('.hover_area'),
          hoverImages = this.element.find('.background_image');

      this._resizeToBaseImage(hoverImages);

      hoverAreas.linkmapAreaClip();
      hoverAreas.linkmapAreaFormat();
      hoverAreas.linkmapAreaVisited();
    },

    _resizeToBaseImage: function(target) {
      var baseImage = this.options.baseImage();

      target
        .width(baseImage.width())
        .height(baseImage.height());
    }
  });

  $.fn.linkmapAreaClip = function(optionalPosition) {
    this.each(function() {
      var hoverArea = $(this);
      var clippedElement = hoverArea.find('.panorama_video, .background_image');
      var position = optionalPosition || hoverArea.position();

      clippedElement.css({
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