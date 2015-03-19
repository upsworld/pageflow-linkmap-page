pageflow.linkmapPage.PanoramaEmbeddedView = Backbone.Marionette.View.extend({
  render: function() {
    this.listenTo(this.model.page, 'change:' + this.options.disableMarginScrollingPropertyName, function(model, disabled) {
      if (disabled) {
        this.$el.linkmapPanorama('disableMarginScrolling');
      }
      else {
        this.$el.linkmapPanorama('enableMarginScrolling');
      }
    });

    return this;
  }
});