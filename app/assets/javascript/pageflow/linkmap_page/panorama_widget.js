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
    lastMouseMoveEvent: null,

    _create: function() {
      var that = this,
          pageElement = this.options.page;

      this.addEnvironment = this.options.addEnvironment;
      this.marginScrolling = !this.options.marginScrollingDisabled;
      this.panorama = this.options.panorama();
      this.limitScrolling = this.options.limitScrolling;
      this.scroller = this.options.scroller;

      this.activeAreas = pageElement.find(this.options.activeAreasSelector);
      this.panoramaWrapper = pageElement.find('.panorama_wrapper');
      this.innerScrollerElement = pageElement.find('.linkmap');
      this.overlayBox = pageElement.find('.description_overlay');
      this.overlayInnerBox = pageElement.find('.description_overlay_wrapper');
      this.overlayTitle = pageElement.find('.description_overlay .link_title');
      this.overlayDescription = pageElement.find('.description_overlay .link_description');

      this.startScrollPosition = _.clone(this.options.startScrollPosition);

      this.currentScrollPosition = null;

      this.refresh();

      this.scroller.onScrollEnd(function() {
        that.updateScrollPosition();
      });

      $(window).on('resize', function () {
        that.centerToPoint(null, 0);
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

        that.stopping = false;

        that.newTimer();
      });

      this.element.on('mouseleave', function() {
        that.stopping = true;
      });

      this.element.on('mousemove', function(e) {
        that.newTimer();

        var containerWidth = that.element.width();
        var containerHeight = that.element.height();
        var activeMargin = 0.2;

        var percentagePositionX = (e.pageX - containerWidth/2) / (containerWidth/2),
          percentagePositionY = (e.pageY - containerHeight/2) / (containerHeight/2),
          onOuterAreasX = (percentagePositionX > 1 - activeMargin*2 || percentagePositionX < -1 + activeMargin*2),
          onOuterAreasY = (percentagePositionY > 1 - activeMargin*2 || percentagePositionY < -1 + activeMargin*2);

        var faktorX = percentagePositionX > 0 ? 1 : -1;
        var faktorY = percentagePositionY > 0 ? 1 : -1;

        that.speedX = onOuterAreasX ? (percentagePositionX - ((1-activeMargin*2)*(faktorX))) / (activeMargin*2) : 0;
        that.speedY = onOuterAreasY ? (percentagePositionY - ((1-activeMargin*2)*(faktorY))) / (activeMargin*2) : 0;

        that.lastMouseMoveEvent = e;
        that.calcAreaOpacity(that.activeAreas, e.pageX, e.pageY);
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

      pageElement.on('mouseenter', '.hover_area', function() {
        positionOverlay($(this));
      });

      $('body').on('mouseleave', '.hover_area', function() {
        that.overlayBox.removeClass('active');
      });

      pageElement.on('dragstart resizestart', '.hover_area', function() {
        that.overlayBox.removeClass('active');
      });

      var positionOverlay = function(area) {
        if (area.is('.editing')) {
          return;
        }

        var linkTitle = area.find('.link_title').html();
        var linkDescription = area.find('.link_description').html();

        if (linkTitle || linkDescription) {
          that.overlayTitle.html(linkTitle);
          that.overlayDescription.html(linkDescription);

          that.overlayBox.addClass('active');

          if(that.panorama.width() - (area.position().left + area.outerWidth()) < that.overlayBox.outerWidth()) {
            var overlayAlignmentDirection = "left";
            that.overlayBox.addClass('left_aligned');
          }
          else {
            var overlayAlignmentDirection = "right";
            that.overlayBox.removeClass('left_aligned');
          }

          if(overlayAlignmentDirection == "right") {
            that.overlayBox.removeClass('left_aligned');
            that.overlayBox.css({
              'left': area.position().left + area.width(),
              'top': area.position().top,
              'margin-top': area.height() / 2
            });
          }
          if(overlayAlignmentDirection == "left") {
            that.overlayBox.addClass('left_aligned');
            that.overlayBox.css({
              'left': area.position().left - that.overlayBox.outerWidth(),
              'top': area.position().top,
              'margin-top': area.height() / 2
            });
          }

          var spaceToBottom = that.panorama.height() - area.position().top;
          var minMargin = 40;

          if(that.overlayBox.outerHeight() > spaceToBottom) {
            that.overlayInnerBox.css('top', (spaceToBottom - that.overlayInnerBox.outerHeight() - minMargin - area.height() / 2) + 'px');
          }
          else {
            that.overlayInnerBox.css('top', '0px');
          }
        }
      }

      this.refresh();
    },

    enableMarginScrolling: function() {
      this.marginScrollingDisabled = false;
    },

    disableMarginScrolling: function() {
      this.marginScrollingDisabled = true;
    },

    calcAreaOpacity: function(activeAreas, mX, mY) {
      var pageElement = this.options.page;
      var distanceLimit = pageElement.width() > pageElement.height() ? pageElement.height() : pageElement.width();
      var minOpacity = 0.1;
      activeAreas.each(function() {
        var distance = calculateDistance($(this), mX, mY);
        if(distance <= distanceLimit) {
          var opacity = 1 + minOpacity - Math.sqrt(distance / distanceLimit);
          $(this).find('.linkmap_marker').css('opacity', opacity);
        }
        else {
          $(this).find('.linkmap_marker').css('opacity', minOpacity);
        }


      });

      function calculateDistance(elem, mouseX, mouseY) {
        return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(mouseY - (elem.offset().top+(elem.height()/2)), 2)));
      }
    },

    newTimer: function() {
      if (!this.scrollTimer) {
        var that = this;

        this.scrollTimer = setInterval(function() {
          var scrollX;
          var scrollY;

          if (that.stopping) {
            that.speedX = that.speedX * 0.8;
            that.speedY = that.speedY * 0.8;

            if (Math.abs(that.speedX) < 0.001 &&
                Math.abs(that.speedY) < 0.001) {
              clearInterval(that.scrollTimer);

              that.speedX = 0;
              that.speedY = 0;

              that.scrollTimer = null;
              that.stopping = false;
            }
          }

          scrollX = -that.speedX * that.speedUp;
          scrollY = -that.speedY * that.speedUp;

          if(!that.drag && that.marginScrolling && !that.marginScrollingDisabled) {
            that.scroller.scrollBy(scrollX, scrollY);
            that.updateScrollPosition();
          }
        }, 25);
      }
    },

    getScrollArea: function(activeAreas) {
      var panorama = this.panorama;
      var pageElement = this.options.page;
      var startScrollPosition = this.startScrollPosition;
      var scrollArea;

      if (activeAreas.length && this.limitScrolling) {
        scrollArea = {
          top: this.startScrollPosition.y * panorama.height(),
          left: this.startScrollPosition.x * panorama.width(),
          bottom: this.startScrollPosition.y * panorama.height(),
          right: this.startScrollPosition.x * panorama.width(),
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

    update: function(addEnvironment, limitScrolling, marginScrollingDisabled, startScrollPosition, minScaling) {
      this.addEnvironment = addEnvironment;
      this.limitScrolling = limitScrolling;
      this.marginScrolling = !marginScrollingDisabled;
      this.startScrollPosition = _.clone(startScrollPosition);
      this.minScaling = minScaling;

      this.refresh();
    },

    refresh: function() {
      this.keepingScrollPosition(function() {
        var pageElement = this.options.page;

        this.panorama = this.options.panorama();

        this.panoramaSize = this.getPanoramaSize(pageElement);
        this.panorama.width(this.panoramaSize.width);
        this.panorama.height(this.panoramaSize.height);

        this.activeAreas = pageElement.find(this.options.activeAreasSelector);
        this.scrollArea = this.getScrollArea(this.activeAreas);

        this.innerScrollerElement.addClass('measuring');

        this.innerScrollerElement.width(this.scrollArea.right - this.scrollArea.left);
        this.innerScrollerElement.height(this.scrollArea.bottom - this.scrollArea.top);

        var maxTranslateX = this.panoramaSize.width - pageElement.width();
        var maxTranslateY = this.panoramaSize.height - pageElement.height();

        this.panoramaWrapper.css({
          left: -Math.min(maxTranslateX, this.scrollArea.left) +'px',
          top: -Math.min(maxTranslateY, this.scrollArea.top) + 'px'
        });

        this.innerScrollerElement.removeClass('measuring');
        this.scroller.refresh();

        var leftToCenterInnerScroller = (pageElement.width() - (this.scrollArea.right - this.scrollArea.left)) / 2;
        var topToCenterInnerScroller = (pageElement.height() - (this.scrollArea.bottom - this.scrollArea.top)) / 2;

        this.innerScrollerElement.css('left', (this.scroller.maxX() == 0 && this.panoramaSize.width > this.scrollArea.right - this.scrollArea.left ? Math.min(leftToCenterInnerScroller, this.scrollArea.left) : 0) + "px");
        this.innerScrollerElement.css('top', (this.scroller.maxY() == 0 && this.panoramaSize.height > pageElement.height() ? Math.min(topToCenterInnerScroller, this.scrollArea.top) : 0) + "px");
      });
    },

    getPanoramaSize: function(pageElement) {
      var result = {};
      var windowRatio = pageElement.width() / pageElement.height();
      var environmentMargin = this.addEnvironment ? (1 + this.environmentMargin) : 1;
      var smallestScale = this.getMinScale(this.activeAreas);
      var imageRatio;

      if (this.panorama.attr('data-height') > 0) {
        imageRatio = this.panorama.attr('data-width') / this.panorama.attr('data-height');
      }
      else {
        imageRatio = 1;
      }

      if(imageRatio > windowRatio) {
        result.height = pageElement.height() * environmentMargin;
        result.width = result.height * imageRatio;
      }
      else {
        result.width = pageElement.width() * environmentMargin;
        result.height = result.width / imageRatio;
      }

      if (result.width < this.panorama.attr('data-width') * smallestScale) {
        result.width = this.panorama.attr('data-width') * smallestScale;
        result.height = this.panorama.attr('data-height') * smallestScale;
      }

      return result;
    },

    centerToPoint: function(point, time) {
      point = point || this.currentScrollPosition;

      var absoluteX = this.scroller.maxX() * point.x;
      var absoluteY = this.scroller.maxY() * point.y;

      this.scroller.scrollTo(absoluteX, absoluteY, time);

      this.currentScrollPosition = this.currentScrollPosition || point;
    },

    keepingScrollPosition: function(fn) {
      var panoramaPosition;

      if (this.currentScrollPosition) {
        panoramaPosition = this.scrollerToPanorama(this.currentScrollPosition);
      }
      else {
        panoramaPosition = this.startScrollPosition;
      }

      fn.call(this);

      this.centerToPoint(this.panoramaToScroller(panoramaPosition));
    },

    scrollerToPanorama: function(point) {
      var scrollAreaWidth = (this.scrollArea.right - this.scrollArea.left);
      var scrollAreaHeight = (this.scrollArea.bottom - this.scrollArea.top);

      return {
        x: this.panoramaSize.width === 0 ?
          0 :
          (this.scrollArea.left + point.x * scrollAreaWidth) / this.panoramaSize.width,
        y: this.panoramaSize.height === 0?
          0 :
          (this.scrollArea.top + point.y * scrollAreaHeight) / this.panoramaSize.height
      };
    },

    panoramaToScroller: function(point) {
      var scrollAreaWidth = (this.scrollArea.right - this.scrollArea.left);
      var scrollAreaHeight = (this.scrollArea.bottom - this.scrollArea.top);

      return {
        x: scrollAreaWidth === 0 ?
          0 :
          (point.x * this.panoramaSize.width - this.scrollArea.left) / scrollAreaWidth ,
        y: scrollAreaHeight === 0 ?
          0 :
          (point.y * this.panoramaSize.height - this.scrollArea.top) / scrollAreaHeight
      };
    },

    updateScrollPosition: function() {
      var that = this;

      setTimeout(function() {
        that.currentScrollPosition.x = that.scroller.maxX() !== 0 ? that.scroller.positionX() / that.scroller.maxX() : 0;
        that.currentScrollPosition.y = that.scroller.maxY() !== 0 ? that.scroller.positionY() / that.scroller.maxY() : 0;
      }, 10);

      this.calcAreaOpacity(this.activeAreas, this.lastMouseMoveEvent.pageX, this.lastMouseMoveEvent.pageY);

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
