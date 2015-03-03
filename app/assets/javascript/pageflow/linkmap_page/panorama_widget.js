(function($) {
  $.widget('pageflow.linkmapPanorama', {
    _create: function() {
      var that = this,
          pageElement = this.options.page,
          scroller = this.options.scroller;

      this.panorama = this.element.find('.panorama');

      this.refresh();

      var scrollTimer,
          containerWidth = this.element.width(),
          containerHeight = this.element.height(),
          margin = 0.2,
          speedX = 0,
          speedY = 0,
          speedUp = 30,
          drag = false;

      this.element.on('mousedown touchstart', function () {
        drag = true;
      });

      this.element.on('mouseup touchend', function () {
        drag = false;
      });

      this.element.on('mouseenter', function() {
        speedX = 0;
        speedY = 0;

        newTimer();
      });

      this.element.on('mouseleave', function() {
        speedX = 0;
        speedY = 0;

        clearInterval(scrollTimer);
        scrollTimer = null;
      });

      this.element.on('mousemove', function(e) {
        newTimer();

        containerWidth = that.element.width();
        containerHeight = that.element.height();

        var percentagePositionX = (e.pageX - containerWidth/2) / (containerWidth/2),
          percentagePositionY = (e.pageY - containerHeight/2) / (containerHeight/2),
          onOuterAreasX = (percentagePositionX > 1 - margin*2 || percentagePositionX < -1 + margin*2),
          onOuterAreasY = (percentagePositionY > 1 - margin*2 || percentagePositionY < -1 + margin*2);

        var faktorX = percentagePositionX > 0 ? 1 : -1;
        var faktorY = percentagePositionY > 0 ? 1 : -1;

        speedX = onOuterAreasX ? (percentagePositionX - ((1-margin*2)*(faktorX))) / (margin*2) : 0;
        speedY = onOuterAreasY ? (percentagePositionY - ((1-margin*2)*(faktorY))) / (margin*2) : 0;
      });

      function newTimer() {
        if (!scrollTimer) {
          scrollTimer = setInterval(function() {
            var scrollX = -speedX * speedUp;
            var scrollY = -speedY * speedUp;

            if(!drag) {
              scroller.scrollBy(scrollX, scrollY);
            }
          }, 25);
        }
      }
    },

    refresh: function() {
      var portrait = this.panorama.attr('data-height') > this.panorama.attr('data-width');
      var imageRatio = this.panorama.attr('data-width') / this.panorama.attr('data-height');

      if (portrait) {
        this.panorama.width(this.options.page.width() * 1.2);
        this.panorama.height(this.options.page.width() * 1.2 / imageRatio);
      }
      else {
        this.panorama.height(this.options.page.height() * 1.2);
        this.panorama.width(this.options.page.height() * 1.2 * imageRatio);
      }
    }
  });
}(jQuery));
