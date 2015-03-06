pageflow.pageType.register('linkmap_page', _.extend({
  prepareNextPageTimeout: 0,
  lastPanoramaPosition: 0,

  scrollerOptions: {
    freeScroll: true,
    scrollX: true
  },

  enhance: function(pageElement, configuration) {
    this.content = pageElement.find('.scroller');
    this.panorama = pageElement.find('.linkmap');
    this.content.linkmapPanorama({
      page: pageElement,
      scroller: this.scroller,
      scrollX: true,
      scrollY: false
    });

    this.linkmapAreas = pageElement.find('.linkmap_areas');
    this.linkmapAreas.linkmap({
      baseImage: pageElement.find('.panorama')
    });

    this.setupPageLinkAreas(pageElement);
    this.setupAudioFileAreas(pageElement);
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
    this.content.linkmapPanorama('refresh');
    this.scroller.refresh();
    this.linkmapAreas.linkmap('refresh');
    this.content.linkmapPanorama("centerToPoint", 0.5, 0.5);
  },

  prepare: function(pageElement, configuration) {
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    var that = this;

    this.videoPlayer.ensureCreated();
    pageElement.find('.panorama_image').toggleClass('active', configuration['background_type'] === 'image');
    pageElement.find('.panorama_video').toggleClass('active', configuration['background_type'] === 'video');

    this.resize(pageElement, configuration);
    this.scroller.refresh();
  },

  activated: function(pageElement, configuration) {
    this.scroller.refresh();
  },

  deactivating: function(pageElement, configuration) {
    this.poolPlayer.pause();
  },

  deactivated: function(pageElement, configuration) {},

  update: function(pageElement, configuration) {
    this.updateCommonPageCssClasses(pageElement, configuration);

    this.content.linkmapPanorama("refresh");

    this.updateLinkmapAfterEmbeddedViewsHaveBeenUpdated();

    if(configuration.get('panorama_initial_position') != this.lastPanoramaPosition) {
     // this.panorama.linkmapPanorama('goTo', configuration.get('panorama_initial_position'));
    }

    this.lastPanoramaPosition = configuration.get('panorama_initial_position');
  },

  updateLinkmapAfterEmbeddedViewsHaveBeenUpdated: function() {
    setTimeout(_.bind(function() {
      this.linkmapAreas.linkmap('refresh');
    }, this), 10);
  },

  _initVideoPlayer: function(pageElement, configuration) {
    var that = this;
    var template =pageElement.find('[data-template=video]');

    that.min_w = 300; // minimum video width allowed
    that.vid_w_orig = template.attr("data-video-width") || 1280;
    this.vid_h_orig = template.attr("data-video-height") || 720;

    console.log('video geo', that.vid_w_orig, that.vid_h_orig);

    this.videoPlayer = new pageflow.VideoPlayer.Lazy(template, {
      width: '100%',
      height: '100%'
    });
  }
}, pageflow.commonPageCssClasses));
