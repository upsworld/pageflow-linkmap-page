pageflow.pageType.register('linkmap_page', _.extend({
  prepareNextPageTimeout: 0,

  scrollerOptions: {
    freeScroll: true,
    scrollX: true
  },

  enhance: function(pageElement, configuration) {
    this.setupPanoramaBackground(pageElement, configuration);
    this.setupVideoPlayer(pageElement);

    this.content = pageElement.find('.scroller');
    this.content.linkmapPanorama({
      page: pageElement,
      scroller: this.scroller
    });

    this.linkmapAreas = pageElement.find('.linkmap_areas');
    this.linkmapAreas.linkmap({
      baseImage: function() {
        return pageElement.find('.panorama.active');
      }
    });

    this.setupPageLinkAreas(pageElement);
    this.setupAudioFileAreas(pageElement);
  },

  setupPanoramaBackground: function(pageElement, configuration) {
    pageElement.find('.panorama_image')
      .toggleClass('active', configuration.background_type === 'image');

    pageElement.find('.panorama_video')
      .toggleClass('active', configuration.background_type === 'video');
  },

  setupVideoPlayer: function(pageElement) {
    var wrapper = pageElement.find('.panorama_video');
    var template = wrapper.find('[data-template=video]');

    wrapper
      .attr('data-width', template.data('videoWidth'))
      .attr('data-height', template.data('videoHeight'));

    this.videoPlayer = new pageflow.VideoPlayer.Lazy(template, {
      width: '100%',
      height: '100%'
    });

    wrapper.data('videoPlayer', this.videoPlayer);
  },

  setupPageLinkAreas: function(pageElement) {
    pageElement.on('click', '[data-page]', function(e) {
      var area = $(this);
      pageflow.slides.goToByPermaId(area.data('page'), {
        transition: area.data('pageTransition')
      });
      return false;
    });
  },

  setupAudioFileAreas: function(pageElement) {
    var player = this.poolPlayer = pageflow.audio.createMultiPlayer({fadeDuration: 1000});

    pageElement.on('click', '[data-audio-file]', function() {
      player.play($(this).data('audioFile'));
      return false;
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
    this.linkmapAreas.linkmap('refresh');

    this.scroller.refresh();
  },

  prepare: function(pageElement, configuration) {
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    var that = this;

    this.resize(pageElement, configuration);
    this.scroller.refresh();

    if (configuration.background_type === 'video') {
      this.videoPlayer.ensureCreated();

      this.prebufferingPromise = this.videoPlayer.prebuffer().then(function() {
        that.videoPlayer.volume(0);
        that.videoPlayer.play();
      });
    }
  },

  activated: function(pageElement, configuration) {
  },

  deactivating: function(pageElement, configuration) {
    this.poolPlayer.pause();
  },

  deactivated: function(pageElement, configuration) {
    this.videoPlayer.pause();
    this.videoPlayer.scheduleDispose();
  },

  update: function(pageElement, configuration) {
    this.setupPanoramaBackground(pageElement, configuration.attributes);
    this.updateCommonPageCssClasses(pageElement, configuration);

    this.afterEmbeddedViewsUpdate(function() {
      this.content.linkmapPanorama('refresh');
      this.linkmapAreas.linkmap('refresh');
      this.scroller.refresh();
    });
  },

  afterEmbeddedViewsUpdate: function(fn) {
    setTimeout(_.bind(fn, this), 10);
  },
}, pageflow.commonPageCssClasses));
