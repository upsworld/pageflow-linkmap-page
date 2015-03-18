(function($) {
  $.widget('pageflow.linkmapPanorama', {
    speedX : 0,
    speedY : 0,
    speedUp : 30,
    drag : false,
    marginScrollingDisabled : false,
    scrollHoverMargin : 0.2,
    environmentMargin : 0.2,
    minScaling: true,
    minScalingSize: 50,

    _create: function() {
      var that = this,
          pageElement = this.options.page;

      this.addEnvironment = this.options.addEnvironment;
      this.marginScrollingDisabled = this.options.marginScrollingDisabled;
      this.activeAreas = pageElement.find(this.options.activeAreasSelector);
      this.panorama = this.options.panorama();
      this.panoramaWrapper = this.element.find('.panorama_wrapper');

      this.limitScrolling = this.options.limitScrolling;

      this.innerScrollerElement = this.element.find('.linkmap');

      this.scroller = this.options.scroller;

      this.startScrollPosition = {
        x: this.options.startX,
        y: this.options.startY
      };

      this.currentScrollPosition = {
        x: this.options.startX,
        y: this.options.startY
      };

      this.scrollArea = this.getScrollArea(this.activeAreas);

      var containerWidth = this.element.width(),
          containerHeight = this.element.height(),
          activeMargin = 0.2;

      this.centerToPoint(this.startScrollPosition.x, this.startScrollPosition.y, 1000);

      this.scroller.onScrollEnd(function() {
        that.updateScrollPosition();
      });

      $(window).on('resize', function () {
        that.centerToPoint(that.currentScrollPosition.x, that.currentScrollPosition.y, 0);
      });

      this.element.on('mousedown touchstart', function () {
        that.drag = true;
      });

      this.element.on('mouseup touchend', function () {
        that.drag = false;
      });

      this.element.on('mouseenter', function() {
        that.speedX = 0;
        that.speedY = 0;

        that.newTimer();
      });

      this.element.on('mouseleave', function() {
        that.speedX = 0;
        that.speedY = 0;

        clearInterval(that.scrollTimer);
        that.scrollTimer = null;
      });

      this.element.on('mousemove', function(e) {
        that.newTimer();

        containerWidth = that.element.width();
        containerHeight = that.element.height();

        var percentagePositionX = (e.pageX - containerWidth/2) / (containerWidth/2),
          percentagePositionY = (e.pageY - containerHeight/2) / (containerHeight/2),
          onOuterAreasX = (percentagePositionX > 1 - activeMargin*2 || percentagePositionX < -1 + activeMargin*2),
          onOuterAreasY = (percentagePositionY > 1 - activeMargin*2 || percentagePositionY < -1 + activeMargin*2);

        var faktorX = percentagePositionX > 0 ? 1 : -1;
        var faktorY = percentagePositionY > 0 ? 1 : -1;

        that.speedX = onOuterAreasX ? (percentagePositionX - ((1-activeMargin*2)*(faktorX))) / (activeMargin*2) : 0;
        that.speedY = onOuterAreasY ? (percentagePositionY - ((1-activeMargin*2)*(faktorY))) / (activeMargin*2) : 0;
      });

      this.element.on('touchstart', function () {
        that.drag = true;
      });

      this.element.on('touchend', function () {
        that.initialBeta = null;
        that.initialGamma = null;
        that.drag = false;
      });

      $(window).on( "orientationchange", function( event ) {
        that.initialBeta = null;
        that.initialGamma = null;
        that.drag = false;
      });

      this.refresh();
    },

    newTimer: function() {
      if (!this.scrollTimer) {
        var that = this;
        this.scrollTimer = setInterval(function() {
          var scrollX = -that.speedX * that.speedUp;
          var scrollY = -that.speedY * that.speedUp;

          if(!that.drag && !that.marginScrollingDisabled) {
            that.scroller.scrollBy(scrollX, scrollY);
            that.updateScrollPosition();
          }
        }, 25);
      }
    },

    getScrollArea: function(activeAreas) {
      var panorama = this.panorama;
      var pageElement = this.options.page;
      var that = this;
      var startScrollPosition = that.startScrollPosition;
      var scrollArea;

      if (activeAreas.length && that.limitScrolling) {
        scrollArea = {
          top: that.startScrollPosition.y * panorama.height(),
          left: that.startScrollPosition.x * panorama.width(),
          bottom: that.startScrollPosition.y * panorama.height(),
          right: that.startScrollPosition.x * panorama.width(),
        };

        activeAreas.each(function() {
          var el = $(this);

          scrollArea.top = scrollArea.top > el.position().top ? el.position().top : scrollArea.top;
          scrollArea.left = scrollArea.left > el.position().left ? el.position().left : scrollArea.left;
          scrollArea.bottom = scrollArea.bottom < el.position().top + el.height() ? el.position().top + el.height() : scrollArea.bottom;
          scrollArea.right = scrollArea.right < el.position().left + el.width() ? el.position().left + el.width() : scrollArea.right;
        });

        scrollArea.top = Math.max(0, scrollArea.top - pageElement.height() * this.scrollHoverMargin);
        scrollArea.left = Math.max(0, scrollArea.left - pageElement.width() * this.scrollHoverMargin);
        scrollArea.bottom = Math.min(panorama.height(), scrollArea.bottom + pageElement.height() * this.scrollHoverMargin);
        scrollArea.right = Math.min(panorama.width(), scrollArea.right + pageElement.width() * this.scrollHoverMargin);
      }
      else {
        scrollArea = {
          top: panorama.position().top,
          left: panorama.position().left,
          bottom: (panorama.position().top + panorama.height()),
          right: (panorama.position().left + panorama.width()),
        };
      }

      return scrollArea;

    },

    getMinScale: function(activeAreas) {
      var smallestScale;
      var that = this;
      var minimumSize = this.minScalingSize;
      var smallestSize = Math.min(this.panorama.attr('data-width'), this.panorama.attr('data-height'));

      if(this.minScaling) {

        for (var i = 0; i < activeAreas.length; i++) {
          var el = $(activeAreas[i]);

          if(el.attr('data-height') / 100 *  that.panorama.attr('data-height') < smallestSize) {
            smallestSize = el.attr('data-height') / 100 *  that.panorama.attr('data-height');
          }
          if(el.attr('data-width') / 100 *  that.panorama.attr('data-width')  < smallestSize) {
            smallestSize = el.attr('data-width') / 100 *  that.panorama.attr('data-width');
          }
          smallestScale = minimumSize / smallestSize;
        }
      } else {
        smallestScale = 0;
      }

      return smallestScale;
    },

    update: function(addEnvironment,limitScrolling,marginScrollingDisabled) {
      this.addEnvironment = addEnvironment;
      this.limitScrolling = limitScrolling;
      this.marginScrollingDisabled = marginScrollingDisabled;
    },

    refresh: function() {
      this.panorama = this.options.panorama();
      var pageElement = this.options.page;
      var windowRatio = pageElement.width() / pageElement.height();
      var imageRatio = this.panorama.attr('data-width') / this.panorama.attr('data-height');
      var that = this;
      var smallestScale = this.getMinScale(this.activeAreas);
      var environmentMargin = this.addEnvironment ? (1 + this.environmentMargin) : 1;

      if(imageRatio > windowRatio) {
        this.panorama.height(pageElement.height() * environmentMargin);
        this.panorama.width(this.panorama.height() * imageRatio);
      }
      else {
        this.panorama.width(pageElement.width() * environmentMargin);
        this.panorama.height(this.panorama.width() / imageRatio);
      }

      if(this.panorama.width() < this.panorama.attr('data-width') * smallestScale) {
        this.panorama.width(this.panorama.attr('data-width') * smallestScale);
        this.panorama.height(this.panorama.attr('data-height') * smallestScale);
      }

      this.activeAreas = $(this.options.activeAreasSelector);

      this.scrollArea = this.getScrollArea(this.activeAreas);

      var topToCenterInnerScroller = (this.scrollArea.bottom - this.scrollArea.top) < pageElement.height() ?
        (pageElement.height() - (this.scrollArea.bottom - this.scrollArea.top)) / 2 : 0;

      var leftToCenterInnerScroller = (this.scrollArea.right - this.scrollArea.left) < pageElement.width() ?
        (pageElement.width() - (this.scrollArea.right - this.scrollArea.left)) / 2 : 0;


      this.innerScrollerElement.addClass('measuring');
      this.innerScrollerElement.width((this.scrollArea.right - this.scrollArea.left) + leftToCenterInnerScroller);
      this.innerScrollerElement.height((this.scrollArea.bottom - this.scrollArea.top) + topToCenterInnerScroller);
      this.innerScrollerElement.removeClass('measuring');

      this.scroller.refresh();
    },

    centerToPoint: function(x, y, time) {
      var that = this;

      x = !x ? this.currentScrollPosition.x : x;
      y = !y ? this.currentScrollPosition.y : y;

      var absoluteX = this.scroller.maxX() * x;
      var absoluteY = this.scroller.maxY() * y;

      this.scroller.scrollTo(absoluteX, this.scroller.iscroll.maxScrollY * y, time);
    },

    updateScrollPosition: function() {
      var that = this;

      setTimeout(function() {
        that.currentScrollPosition.x = that.scroller.maxX() != 0 ? that.scroller.positionX() / that.scroller.maxX() : 0;
        that.currentScrollPosition.y = that.scroller.maxY() != 0 ? that.scroller.positionY() / that.scroller.maxY() : 0;
      }, 10);

    },

    initGyro: function() {
      this.newTimer();

      var that = this;
      var limit = 8;

      gyro.startTracking(function(o) {
          if(!that.initialBeta) {
            that.initialBeta = o.beta;
          }
          if(!that.initialGamma) {
            that.initialGamma = o.gamma;
          }

          if(!this.drag) {
            if($(window).height() >= $(window).width()) {
              that.speedX = o.gamma - that.initialGamma < limit && o.gamma - that.initialGamma > -limit ? 0 : (o.gamma - that.initialGamma) / 90 / 10;
              that.speedY = o.beta - that.initialBeta < limit && o.beta - that.initialBeta > -limit ? 0 : -(o.beta - that.initialBeta) / 90 / 10;
            }
            else {
              that.speedY = o.gamma - that.initialGamma < limit && o.gamma - that.initialGamma > -limit ? 0 : (o.gamma - that.initialGamma) / 90 / 10;
              that.speedX = o.beta - that.initialBeta < limit && o.beta - that.initialBeta > -limit ? 0 : -(o.beta - that.initialBeta) / 90 / 10;
            }
          }
          else {
            that.speedX = 0;
            that.speedY = 0;
          }
      });
    },

    cancelGyro: function() {
      gyro.stopTracking();
    },
  });
}(jQuery));
