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
    this.panorama = pageElement.find('.panorama');

    this.content.linkmapPanorama({
      page: pageElement,
      panorama: function() {
        return pageElement.find('.panorama.active');
      },
      scroller: this.scroller,
      activeAreasSelector: '.linkmap_areas > *',
      limitScrolling: configuration.limit_scrolling,
      addEnvironment: configuration.add_environment,
      marginScrollingDisabled: configuration.margin_scrolling_disabled,
      startScrollPosition: this.getPanoramaStartScrollPosition(configuration)
    });

    this.linkmapAreas = pageElement.find('.linkmap_areas');
    this.linkmapAreas.linkmap({
      baseImage: function() {
        return pageElement.find('.panorama.active');
      }
    });

    this.setupPageLinkAreas(pageElement);
    this.setupAudioFileAreas(pageElement, configuration);
  },

  getPanoramaStartScrollPosition: function(configuration) {
    function getRatio(attributeName) {
      if (attributeName in configuration) {
        return configuration[attributeName] / 100;
      }
      else {
        return 0.5;
      }
    }

    if (configuration.background_type === 'video') {
      return {
        x: getRatio('panorama_video_x'),
        y: getRatio('panorama_video_y')
      };
    }
    else {
      return {
        x: getRatio('panorama_image_x'),
        y: getRatio('panorama_image_y')
      };
    }
  },

  setupPanoramaBackground: function(pageElement, configuration) {
    pageElement.find('.panorama_image')
      .toggleClass('active', configuration.background_type !== 'video');

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
      volumeFading: true,

      width: '100%',
      height: '100%'
    });

    wrapper.data('videoPlayer', this.videoPlayer);
  },

  setupPageLinkAreas: function(pageElement) {
    pageElement.on('click', '[data-target-type="page"]', function(e) {
      var area = $(this);

      pageflow.slides.goToByPermaId(area.data('targetId'), {
        transition: area.data('pageTransition')
      });
      return false;
    });
  },

  setupAudioFileAreas: function(pageElement, configuration) {
    this.multiPlayer = pageflow.audio.createMultiPlayer({
      playFromBeginning: true,
      fadeDuration: 1000,
      hooks: pageflow.Atmo.createMediaPlayerHooks(configuration)
    });

    pageElement.linkmapAudioPlayersController({
      player: this.multiPlayer
    });

    pageElement.find('[data-target-type="audio_file"]').linkmapAudioPlayerControls();
  },

  resize: function(pageElement, configuration) {
    this.content.linkmapPanorama('refresh');
    this.linkmapAreas.linkmap('refresh');
  },

  prepare: function(pageElement, configuration) {
    if (configuration.background_type === 'video') {
      return this.videoPlayer.ensureCreated();
    }
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    var that = this;

    if (configuration.background_type === 'video') {
      this.videoPlayer.ensureCreated();

      this.prebufferingPromise = this.videoPlayer.prebuffer().then(function() {
        that.videoPlayer.play();
      });
    }

    this.content.linkmapPanorama('refresh');
    this.linkmapAreas.linkmap('refresh');

    if(pageflow.browser.has('mobile platform')) {
      this.content.linkmapPanorama('initGyro');
    }
    this.content.linkmapPanorama('centerToPoint');
  },

  activated: function(pageElement, configuration) {
  },

  deactivating: function(pageElement, configuration) {
    this.multiPlayer.pause();

    if(pageflow.browser.has('mobile platform')) {
      this.content.linkmapPanorama('cancelGyro');
    }
  },

  deactivated: function(pageElement, configuration) {
    this.videoPlayer.pause();
    this.videoPlayer.scheduleDispose();
  },

  update: function(pageElement, configuration) {
    this.setupDefaultAreaPositions(configuration);
    this.setupPanoramaBackground(pageElement, configuration.attributes);
    this.updateCommonPageCssClasses(pageElement, configuration);

    this.afterEmbeddedViewsUpdate(function() {
      var minScaling = false;

      this.content.linkmapPanorama('update',
                                   configuration.get('add_environment'),
                                   configuration.get('limit_scrolling'),
                                   configuration.get('margin_scrolling_disabled'),
                                   this.getPanoramaStartScrollPosition(configuration.attributes),
                                   minScaling);

      this.linkmapAreas.linkmap('refresh');
      this.scroller.refresh();
    });
  },

  setupDefaultAreaPositions: function(configuration) {
    if (!this.defaultPositionDefined) {
      var scroller = this.scroller;

      _.each(['linkmap_page_link_areas', 'linkmap_audio_file_areas'], function(propertyName) {
        configuration.linkmapAreas(propertyName).setDefaultPosition(function() {
          return {
            left: getPercent(scroller.positionX(), scroller.maxX()),
            top: getPercent(scroller.positionY(), scroller.maxY())
          };
        });
      });
      this.defaultPositionDefined = true;
    }

    function getPercent(value, max) {
      if (max === 0) {
        return 20;
      }

      return Math.max(3, Math.min(90, value / max * 100));
    }
  },

  afterEmbeddedViewsUpdate: function(fn) {
    setTimeout(_.bind(fn, this), 10);
  },
}, pageflow.commonPageCssClasses));
