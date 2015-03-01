pageflow.pageType.register('linkmap_page', _.extend({
  prepareNextPageTimeout: 0,
  lastPanoramaPosition: 0,

  enhance: function(pageElement, configuration) {
    this.panorama = pageElement.find('.linkmap');
    this.panorama.linkmapPanorama({initialPosition : configuration.panorama_initial_position});
    this.panorama.linkmapPanorama("goTo", configuration.panorama_initial_position);

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
    this.panorama.linkmapPanorama('refresh');
    this.linkmapAreas.linkmap('refresh');
  },

  prepare: function(pageElement, configuration) {
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    this.resize(pageElement, configuration);
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

    this.panorama.linkmapPanorama('refresh');
    this.updateLinkmapAfterEmbeddedViewsHaveBeenUpdated();

    if(configuration.get('panorama_initial_position') != this.lastPanoramaPosition) {
      this.panorama.linkmapPanorama('goTo', configuration.get('panorama_initial_position'));
    }

    this.lastPanoramaPosition = configuration.get('panorama_initial_position');
  },

  updateLinkmapAfterEmbeddedViewsHaveBeenUpdated: function() {
    setTimeout(_.bind(function() {
      this.linkmapAreas.linkmap('refresh');
    }, this), 1);
  }
}, pageflow.commonPageCssClasses));
