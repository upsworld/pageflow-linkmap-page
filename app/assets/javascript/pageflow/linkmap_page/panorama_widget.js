(function($) {
  $.widget('pageflow.linkmapPanorama', {
    _create: function() {
      var that = this,
          pageElement = this.options.page;

      this.activeAreas = $(this.options.activeAreasSelector);


      this.scroller = this.options.scroller;

      this.panorama = this.element.find('.panorama');
      this.limitScrolling = this.options.limitScrolling;


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
          marginScrolling = true,
          scrollHoverAreasOnly = true;

      this.scrollHoverMargin = 0.2;
      this.environmentMargin = 0.2;

      /*this.scrollX = true;
      this.scrollY = false; */

      window.myscroller = this.scroller;

      var that = this;

      this.safeArea = safeArea;

      this.panorama.append('<div style=" position: absolute; left: ' +this.safeArea.upperLeft.x * 100 + '%; top: ' +this.safeArea.upperLeft.y * 100 + '%; width:  ' + (this.safeArea.lowerRight.x - this.safeArea.upperLeft.x) * 100 + '%; height: ' + (this.safeArea.lowerRight.y - this.safeArea.upperLeft.y) * 100 + '%"></div>');

      this.startScrollPosition = {
        x: (safeArea.upperLeft.x + safeArea.lowerRight.x) / 2,
        y: (safeArea.upperLeft.y + safeArea.lowerRight.y) / 2
      };

      this.currentScrollPosition = this.startScrollPosition;

      this.refresh();

      this.centerToPoint(this.startScrollPosition.x, this.startScrollPosition.y, 1000);

      this.scroller.onScrollEnd(function() {
        setTimeout(function() {
          that.currentScrollPosition.x = that.scroller.iscroll.x / that.scroller.iscroll.maxScrollX;
          that.currentScrollPosition.y = that.scroller.iscroll.y / that.scroller.iscroll.maxScrollY;
        }, 10);
      });

      $(window).on('resize', function () {
        that.centerToPoint(that.currentScrollPosition.x, that.currentScrollPosition.y, 0);
      });

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

            if(!drag && marginScrolling) {
              if(scrollHoverAreasOnly) {
                that.scroller.scrollBy(scrollX, scrollY, that.getScrollArea(that.activeAreas));
              }
              else {
                that.scroller.scrollBy(scrollX, scrollY, that.getScrollArea(that.panorama));
              }
            }
          }, 25);
        }
      }
    },
    getScrollArea: function(activeAreas) {
      window.activeAreas = activeAreas;

      var panorama = this.panorama;
      var pageElement = this.options.page;

      if(activeAreas[0]) {
        var firstElement = $(activeAreas[0]);

        var scrollArea = {
          top: firstElement.position().top,
          left: firstElement.position().left,
          bottom: firstElement.position().top + firstElement.height(),
          right: firstElement.position().left + firstElement.width(),
        }

        for (var i = 1; i < activeAreas.length; i++) {
          var el = $(activeAreas[i]);
          scrollArea.top = scrollArea.top > el.position().top ? el.position().top : scrollArea.top;
          scrollArea.left = scrollArea.left > el.position().left ? el.position().left : scrollArea.left;
          scrollArea.bottom = scrollArea.bottom < el.position().top + el.height() ? el.position().top + el.height() : scrollArea.bottom;
          scrollArea.right = scrollArea.right < el.position().left + el.width() ? el.position().left + el.width() : scrollArea.right;
        }


        scrollArea.top = Math.max(0, scrollArea.top - pageElement.height() * this.scrollHoverMargin);
        scrollArea.left = Math.max(0, scrollArea.left - pageElement.width() * this.scrollHoverMargin);
        scrollArea.bottom = Math.min(pageElement.height(), scrollArea.bottom + pageElement.height() * this.scrollHoverMargin);
        scrollArea.right = Math.min(pageElement.width(), scrollArea.right + pageElement.width() * this.scrollHoverMargin);

        if(scrollArea.bottom - scrollArea.top < pageElement.height()) {
          scrollArea.top = this.scroller.iscroll.maxScrollY * this.startScrollPosition.y;
          scrollArea.bottom = this.scroller.iscroll.maxScrollY * this.startScrollPosition.y;
        }
        else {
          scrollArea.top = -scrollArea.top;
          scrollArea.bottom = -(scrollArea.bottom - pageElement.height());
        }

        if(scrollArea.right - scrollArea.left < pageElement.width()) {
          scrollArea.left = this.scroller.iscroll.maxScrollX * this.startScrollPosition.x;
          scrollArea.right = this.scroller.iscroll.maxScrollX * this.startScrollPosition.x;
        }
        else {
          scrollArea.left = -scrollArea.left ;
          scrollArea.right = -(scrollArea.right - pageElement.width());
        }

        console.log('scrollarearight ', scrollArea.right, ' width ', pageElement.width(), ' border right:',-(scrollArea.right - pageElement.width()), '   scrollmaxx ', this.scroller.iscroll.maxScrollX )
      }
      else {
        var scrollArea = {
          top: -panorama.position().top,
          left: -panorama.position().left,
          bottom: -(panorama.position().top + panorama.height()),
          right: -(panorama.position().left + panorama.width()),
        }
      }

      console.log('scrollArea', scrollArea);
      return scrollArea;

    },

    refresh: function() {
      var pageElement = this.options.page;
      var windowRatio = pageElement.width() / pageElement.height();
      var safeAreaX = (this.safeArea.lowerRight.x - this.safeArea.upperLeft.x)
      var safeAreaXpx = safeAreaX * this.panorama.attr('data-width');
      var safeAreaY = (this.safeArea.lowerRight.y - this.safeArea.upperLeft.y);
      var safeAreaYpx = safeAreaY * this.panorama.attr('data-height');
      var safeRatio = safeAreaXpx / safeAreaYpx;
      var imageRatio = this.panorama.attr('data-width') / this.panorama.attr('data-height');

      if(imageRatio > windowRatio) {
        console.log('hans', pageElement.height(), 'imageRatio ' + imageRatio, pageElement.height() * (1 + this.environmentMargin) * imageRatio);
        this.panorama.height(pageElement.height() * (1 + this.environmentMargin));
        this.panorama.width(pageElement.height() * (1 + this.environmentMargin) * imageRatio);
      }
      else {
        console.log('franz');
        this.panorama.width(pageElement.width() * (1 + this.environmentMargin));
        this.panorama.height(pageElement.width() * (1 + this.environmentMargin) / imageRatio);
      }

      console.log('refresh of panorama widget');

      this.activeAreas = $(this.options.activeAreasSelector);

      this.getScrollArea(this.activeAreas);


/*    if(safeAreaXpx <= $(window).width() && safeAreaYpx <= $(window).height()) {
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
      } */


      /* restricting iscroll

      this.scroller.iscroll.hasVerticalScroll = this.options.scrollY;
      this.scroller.iscroll.hasHorizontalScroll = this.options.scrollX; */
    },

    centerToPoint: function(x, y, time) {
      console.log('center to point', x, y);
      var that = this;
    //  this.scroller.iscroll.hasHorizontalScroll = true;
     // this.scroller.iscroll.hasVerticalScroll = true;
      this.scroller.iscroll.scrollTo(this.scroller.iscroll.maxScrollX * x, this.scroller.iscroll.maxScrollY * y, time);
    }
  });
}(jQuery));
