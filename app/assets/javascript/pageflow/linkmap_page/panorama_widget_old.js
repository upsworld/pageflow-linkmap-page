(function($) {
  $.widget('pageflow.linkmapPanorama', {
    _create: function() {
      var linkmap = this.element,
      panorama = this.element.find('.panorama'),
      eventElements = this.element.find('.panorama, .hover_area'),
      initialMousePosition = this.options.initialPosition || 0,
      movingBackground = false,
      preventClickMovement = false,
      movingDelta = 0,
      movingBackgroundInterval,
      initialX = this.options.initialPosition || 0,
      initialMovingStep = 8,
      movingMomentum = 1.05,
      movingStep = initialMovingStep,
      targetX = initialX;
      console.log('initialX', this.options.initialPosition);

      this.panorama = panorama;



      eventElements.on('mousedown', function(e) {
        initialMousePosition = e.pageX;
        var lastDelta = 0;

        movingDelta = 0;
        movingStep = 0;

        clearInterval(movingBackgroundInterval);

        movingBackgroundInterval = setInterval(function() {
          if(movingDelta != 0) {
            if(movingDelta > 0 && targetX <= 100) {
              targetX = targetX + movingStep;
              panorama.css('cursor','e-resize');
            }
            if(movingDelta < 0 && targetX >= 0) {
              targetX = targetX - movingStep;
              panorama.css('cursor','w-resize');
            }
          }
          else {
            panorama.css('cursor','ew-resize');
          }

          if(targetX > 100) { targetX = 100};
          if(targetX < 0) { targetX = 0};

          if(lastDelta > 0 && movingDelta <= 0 || lastDelta < 0 && movingDelta >= 0) {
            movingStep = initialMovingStep;
          }
          lastDelta = movingDelta;
          linkmap.css({'left': targetX + "%", 'transform': 'translate(-' + targetX +'%, 0'});
          movingStep = initialMovingStep * (Math.abs(movingDelta) / linkmap.parent().width());
        }, 20);


        movingBackground = true;
        linkmap.toggleClass('moving_background', movingBackground);

      });

      eventElements.on('mousemove', function(e) {
        if(movingBackground) {
          movingDelta = e.pageX - initialMousePosition;
          preventClickMovement = true;
          e.stopPropagation();
        }

      });

      panorama.on('click', function (e) {
        if(!preventClickMovement) {
          targetX = e.offsetX / $(this).width() * 100;
          linkmap.css({'left': targetX + "%", 'transform': 'translate(-' + targetX +'%, 0'});
        }
        preventClickMovement = false;
      });

      eventElements.on('mouseup mouseleave', function(e) {
        movingBackground = false;
        linkmap.toggleClass('moving_background', movingBackground);
        movingDelta = 0;
        movingStep = 0;
        initialMousePosition = e.pageX;
        panorama.css('cursor','ew-resize');
        clearInterval(movingBackgroundInterval);
        movingStep = initialMovingStep;
      });

    },

    goTo: function(positionPercentage) {
      var linkmap = this.element;

      linkmap.css({'left': positionPercentage + "%", 'transform': 'translate(-' + positionPercentage +'%, 0'});
    },

    refresh: function() {
      var imageRatio = this.panorama.data('width') / this.panorama.data('height'),
        parentRatio = this.element.parent().width() / this.element.parent().height();

      if(imageRatio >= parentRatio) {
        this.panorama.height(this.element.parent().height());
        this.panorama.width(this.panorama.height() * imageRatio);
      }
      else {
        this.panorama.width(this.element.parent().width());
        this.panorama.height(this.panorama.width() / imageRatio);
      }
    }
  });
}(jQuery));

