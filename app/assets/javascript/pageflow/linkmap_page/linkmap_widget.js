(function($) {
  $.widget('pageflow.linkmap', {
    _create: function() {
      this.refresh();
    },

    refresh: function() {
    /*  var hoverAreas = this.element.find('.hover_areas'),
          hoverImages = this.element.find('.background_image'),
          baseImage = this.options.baseImage;

      this.element
        .width(baseImage.width())
        .height(baseImage.height());

      this.element
        .parent()
        .width(baseImage.width())
        .height(baseImage.height());

      hoverImages
        .width(baseImage.width())
        .height(baseImage.height());

      hoverImages.linkmapAreaImage();*/
    },
  });

  $.fn.linkmapAreaImage = function(optionalPosition) {
    this.each(function() {
      var hoverImage = $(this);
      var position = optionalPosition || hoverImage.parent().position();

      hoverImage.css({
        left: -position.left + 'px',
        top: -position.top + 'px'
      });
    });
  };
}(jQuery));