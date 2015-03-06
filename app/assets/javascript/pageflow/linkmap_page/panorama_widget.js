(function($) {
  $.widget('pageflow.linkmapPanorama', {
    _create: function() {
      var that = this,
          pageElement = this.options.page;

      this.scroller = this.options.scroller;

      this.panorama = this.element.find('.panorama');

      this.environment = 1;

      var scrollTimer,
          containerWidth = this.element.width(),
          containerHeight = this.element.height(),
          activeMargin = 0.2,
          speedX = 0,
          speedY = 0,
          speedUp = 30,
          drag = false,
          safeArea = {
            upperLeft: {
              x: 0.04,
              y: 0.33
            },
            lowerRight: {
              x: 0.13,
              y: 0.64
            }
          },
          scrolling = false;


      /*this.scrollX = true;
      this.scrollY = false; */

      window.myscroller = this.scroller;

      console.log('start log für scroller:', this.scroller.iscroll.hasVerticalScroll, this.scroller.iscroll.hasHorizontalScroll);
      var that = this;

      this.safeArea = safeArea;

      this.panorama.append('<div style=" position: absolute; left: ' +this.safeArea.upperLeft.x * 100 + '%; top: ' +this.safeArea.upperLeft.y * 100 + '%; width:  ' + (this.safeArea.lowerRight.x - this.safeArea.upperLeft.x) * 100 + '%; height: ' + (this.safeArea.lowerRight.y - this.safeArea.upperLeft.y) * 100 + '%"></div>');

      this.center = {
        x: (safeArea.upperLeft.x + safeArea.lowerRight.x) / 2,
        y: (safeArea.upperLeft.y + safeArea.lowerRight.y) / 2
      };

      this.refresh();

      this.centerToPoint(this.center.x, this.center.y, 1000);

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
          onOuterAreasX = (percentagePositionX > 1 - activeMargin*2 || percentagePositionX < -1 + activeMargin*2),
          onOuterAreasY = (percentagePositionY > 1 - activeMargin*2 || percentagePositionY < -1 + activeMargin*2);

        var faktorX = percentagePositionX > 0 ? 1 : -1;
        var faktorY = percentagePositionY > 0 ? 1 : -1;

        speedX = onOuterAreasX ? (percentagePositionX - ((1-activeMargin*2)*(faktorX))) / (activeMargin*2) : 0;
        speedY = onOuterAreasY ? (percentagePositionY - ((1-activeMargin*2)*(faktorY))) / (activeMargin*2) : 0;
      });

      function newTimer() {
        if (!scrollTimer) {
          scrollTimer = setInterval(function() {
            var scrollX = -speedX * speedUp;
            var scrollY = -speedY * speedUp;

            if(!drag && scrolling) {
              that.scroller.scrollBy(scrollX, scrollY);
            }
          }, 25);
        }
      }
    },
    refresh: function() {
      var windowRatio = $(window).width() / $(window).height();
      var safeAreaX = (this.safeArea.lowerRight.x - this.safeArea.upperLeft.x)
      var safeAreaXpx = safeAreaX * this.panorama.attr('data-width');
      var safeAreaY = (this.safeArea.lowerRight.y - this.safeArea.upperLeft.y);
      var safeAreaYpx = safeAreaY * this.panorama.attr('data-height');
      var safeRatio = safeAreaXpx / safeAreaYpx;
      var imageRatio = this.panorama.attr('data-width') / this.panorama.attr('data-height');

      if(safeAreaXpx <= $(window).width() && safeAreaYpx <= $(window).height()) {
      /*  console.log('safe area in screen');
        if (imageRatio <= windowRatio) {
          this.panorama.width(this.options.page.width() * this.environment);
          this.panorama.height(this.options.page.width() * this.environment / imageRatio);
        }
        else {
          this.panorama.height(this.options.page.height() * this.environment);
          this.panorama.width(this.options.page.height() * this.environment * imageRatio);
        } */

        console.log('yeah', safeAreaXpx, safeAreaYpx);
        this.panorama.height(this.panorama.attr('data-height'));
        this.panorama.width(this.panorama.attr('data-width'));
      }
      else {
        console.log('safe area out of screen');
        if (safeRatio <= windowRatio) {
          console.log('safeRatio <= windowRatio');
          var heightRatio = 1/safeAreaY;
          this.panorama.height(this.options.page.height() * heightRatio);
          this.panorama.width(this.options.page.height() * heightRatio * imageRatio);

        }
        else {
          console.log('safeRatio > windowRatio');
          var widthRatio = 1/safeAreaX;
          this.panorama.width(this.options.page.width() * widthRatio);
          this.panorama.height(this.options.page.width() * widthRatio / imageRatio);
        }
      }
      this.scroller.iscroll.hasVerticalScroll = this.options.scrollY;
      this.scroller.iscroll.hasHorizontalScroll = this.options.scrollX;
    },

    centerToPoint: function(x, y, time) {
      var that = this;
    //  this.scroller.iscroll.hasHorizontalScroll = true;
     // this.scroller.iscroll.hasVerticalScroll = true;
      this.scroller.iscroll.scrollTo(this.scroller.iscroll.maxScrollX * x, this.scroller.iscroll.maxScrollY * y, time);
    }
  });
}(jQuery));
