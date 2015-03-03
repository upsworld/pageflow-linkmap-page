pageflow.pageType.register('linkmap_page', _.extend({
  prepareNextPageTimeout: 0,
  lastPanoramaPosition: 0,

  enhance: function(pageElement, configuration) {
    this.content = pageElement.find('.scroller');
    this.panorama = pageElement.find('.linkmap');
    this.panorama.linkmapPanorama();
//    this.panorama.linkmapPanorama("goTo", configuration.panorama_initial_position);

    var that = this;
    this.panorama.find('img').load(function() {
      that.content.scroller('refresh');
    });

    window.myscroller = that.content.scroller('returnScroller');

    this.scroller = that.content.scroller('returnScroller');


    this.linkmapAreas = pageElement.find('.linkmap_areas');
    this.linkmapAreas.linkmap({
      baseImage: pageElement.find('.panorama')
    });

    this.setupPageLinkAreas(pageElement);
    this.setupAudioFileAreas(pageElement);

    var scrollTimer,
      containerWidth = this.content.width(),
      containerHeight = this.content.height(),
      margin = 0.2,
      speedX = 0,
      speedY = 0,
      speedUp = 30,
      faktorX = 0,
      faktorY = 0;



    this.content.on('mouseenter', function() {
      speedX = 0;
      speedY = 0;

      newTimer();
    });

    this.content.on('mouseleave', function() {
      speedX = 0;
      speedY = 0;

      clearInterval(scrollTimer);
    });

    this.content.on('mousemove', function(e) {

      if(!scrollTimer) {newTimer();};
      containerWidth = that.content.width(),
      containerHeight = that.content.height();

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

        if(that.scroller.x + scrollX > 0 || that.scroller.x + scrollX < that.scroller.maxScrollX) {
          scrollX = 0;
        }
        if(that.scroller.y + scrollY > 0 || that.scroller.y + scrollY < that.scroller.maxScrollY) {
          scrollY = 0;
        }

        that.scroller.scrollBy(scrollX, scrollY);

//          that.scroller.x > 0 && that.scroller.x < that.scroller.maxScrollX? scrollX : 0,
//          that.scroller.y > 0 && that.scroller.y < that.scroller.maxScrollY? scrollY : 0);
      },25);
    }


  },

  setupPageLinkAreas: function(pageElement) {
    pageElement.on('click', '[data-page]', function(e) {
      var area = $(this);
      pageflow.slides.goToByPermaId(area.data('page'), {
        transition: area.data('pageTransition')
      });
    });
  },

  setupAudioFileAreas: function(pageElement) {
    var player = this.poolPlayer = pageflow.audio.createMultiPlayer({fadeDuration: 1000});

    pageElement.on('click', '[data-audio-file]', function() {
      player.play($(this).data('audioFile'));
    });

    player.on('play', function(options) {
      resetHighlights();
      highlight(options.audioFileId);
    });

    player.on('ended', resetHighlights);

    function highlight(audioFileId) {
      pageElement.find('[data-audio-file="' + audioFileId + '"]').addClass('playing');
    }

    function resetHighlights() {
      pageElement.find('[data-audio-file]').removeClass('playing');
    }
  },

  resize: function(pageElement, configuration) {
   // this.panorama.linkmapPanorama('refresh');
    //this.linkmapAreas.linkmap('refresh');
  },

  prepare: function(pageElement, configuration) {
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
   // this.resize(pageElement, configuration);
   this.content.scroller('refresh');
  },

  activated: function(pageElement, configuration) {
  },

  deactivating: function(pageElement, configuration) {
    this.poolPlayer.pause();
  },

  deactivated: function(pageElement, configuration) {},

  update: function(pageElement, configuration) {
    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('.contentText p').html(configuration.get('text') || '');

    this.updateCommonPageCssClasses(pageElement, configuration);

    pageElement.find('.shadow').css({
      opacity: configuration.get('gradient_opacity') / 100
    });

    //this.panorama.linkmapPanorama('refresh');
    this.updateLinkmapAfterEmbeddedViewsHaveBeenUpdated();

    if(configuration.get('panorama_initial_position') != this.lastPanoramaPosition) {
     // this.panorama.linkmapPanorama('goTo', configuration.get('panorama_initial_position'));
    }

    this.lastPanoramaPosition = configuration.get('panorama_initial_position');
  },

  updateLinkmapAfterEmbeddedViewsHaveBeenUpdated: function() {
    setTimeout(_.bind(function() {
      //this.linkmapAreas.linkmap('refresh');
    }, this), 1000);
  }
}, pageflow.commonPageCssClasses));
