/*global IScroll*/

pageflow.pageType.register('linkmap_page', _.extend({
  prepareNextPageTimeout: 0,
  lastPanoramaPosition: 0,

  enhance: function(pageElement, configuration) {
    var scrollerElement = pageElement.find('.ext-links'),
    that = this;

    this.panorama = pageElement.find('.linkmap');
    this.panorama.linkmapPanorama({initialPosition : configuration.panorama_initial_position});
    this.panorama.linkmapPanorama("goTo", configuration.panorama_initial_position);

    this.baseImage = pageElement.find('.linkmap_image');

    pageElement.find('.hover_area').on('mousemove', function(e) {
      e.preventDefault();
    });

    this.scroller = new IScroll(scrollerElement[0], {
      mouseWheel: true,
      bounce: false,
      keyBindings: true,
      scrollX: true,
      scrollY: false,
      probeType: 2,
      eventPassthrough: true
    });

  },

  resize: function(pageElement, configuration) {

    this.panorama.linkmapPanorama('refresh');
    this.adjustOverlayingImages(pageElement, this.panorama.find('.panorama'));
    this.scroller.refresh();
  },

  adjustOverlayingImages: function(pageElement, baseImage) {
    var hoverAreas = pageElement.find('.hover_area'),
      hoverImages = pageElement.find('.hover_area div'),
      linkmapContainer = pageElement.find('.linkmap_areas');

    linkmapContainer.width(baseImage.width()).height(baseImage.height());
    linkmapContainer.parent().width(baseImage.width()).height(baseImage.height());
    hoverImages.width(baseImage.width()).height(baseImage.height());

    function positionImage(image, index, array) {
      image.css({"left": -image.parent().position().left + "px","top": -image.parent().position().top + "px"});
    }

    for(var i = 0; i < hoverImages.length; i++) {
      positionImage($(hoverImages[i]));
    }
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

  deactivating: function(pageElement, configuration) {},

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

    console.log('compare', configuration.get('panorama_initial_position'), this.lastPanoramaPosition);

    if(configuration.get('panorama_initial_position') != this.lastPanoramaPosition) {
      this.panorama.linkmapPanorama('goTo', configuration.get('panorama_initial_position'));
    }

    this.lastPanoramaPosition = configuration.get('panorama_initial_position');
  },

  embeddedEditorViews: function() {
    return {
      '.panorama': {
        view: pageflow.BackgroundImageEmbeddedView,
        options: {propertyName: 'background_image_id', dataSizeAttributes : true}
      },

      '.linkmap_areas': {
        view: pageflow.linkmapPage.AreasEmbeddedView,
        options: {propertyName: 'linked_page_ids'}
      }
    };
  }
}, pageflow.commonPageCssClasses));
