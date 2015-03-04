(function($) {
  $.widget('pageflow.linkmapPanorama', {
    _create: function() {

      var that = this,
        pageElement = this.options.page;

      this.img = this.element.find('.panorama');

      this.img.load(function() {
        that.content.scroller('refresh');
      });

      this.refresh();

      window.myscroller = this.element.scroller('returnScroller');

      this.scroller = this.element.scroller('returnScroller');

      var scrollTimer,
        containerWidth = this.element.width(),
        containerHeight = this.element.height(),
        margin = 0.2,
        speedX = 0,
        speedY = 0,
        speedUp = 30,
        faktorX = 0,
        faktorY = 0,
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
      });

      this.element.on('mousemove', function(e) {

        if(!scrollTimer) {newTimer();};
        containerWidth = that.element.width(),
        containerHeight = that.element.height();

        var percentagePositionX = (e.pageX - containerWidth/2) / (containerWidth/2),
          percentagePositionY = (e.pageY - containerHeight/2) / (containerHeight/2),
          onOuterAreasX = (percentagePositionX > 1 - margin*2 || percentagePositionX < -1 + margin*2),
          onOuterAreasY = (percentagePositionY > 1 - margin*2 || percentagePositionY < -1 + margin*2);

        faktorX = percentagePositionX > 0 ? 1 : -1;
        faktorY = percentagePositionY > 0 ? 1 : -1;

        speedX = onOuterAreasX ? (percentagePositionX - ((1-margin*2)*(faktorX))) / (margin*2) : 0;
        speedY = onOuterAreasY ? (percentagePositionY - ((1-margin*2)*(faktorY))) / (margin*2) : 0;
      });

      function newTimer() {
        scrollTimer = setInterval(function() {
          var scrollX = -speedX * speedUp;
          var scrollY = -speedY * speedUp;

          if(that.scroller.x + scrollX > 0) {
            scrollX = -that.scroller.x;
          }
          if(that.scroller.x + scrollX < that.scroller.maxScrollX) {
            scrollX = that.scroller.maxScrollX - that.scroller.x;
          }
          if(that.scroller.y + scrollY > 0) {
            scrollY = -that.scroller.y;
          }
          if(that.scroller.y + scrollY < that.scroller.maxScrollY) {
            scrollY = that.scroller.maxScrollY - that.scroller.y;
          }

          if(!drag) {
            that.scroller.scrollBy(scrollX, scrollY);
          }

        },25);
      }
    },
    refresh: function() {
      var portrait = this.img.attr('data-height') > this.img.attr('data-width'),
      imageRatio = this.img.attr('data-width') / this.img.attr('data-height');

      if (portrait) {

      }
      else {
        this.img.height(this.options.page.height() * 1.2);
        this.img.width(this.options.page.height() * 1.2 * imageRatio);
      }
    }
  });
}(jQuery));

