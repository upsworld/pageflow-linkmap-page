pageflow.linkmapPage.PanoramaEmbeddedView = Backbone.Marionette.View.extend({
  render: function() {
    this.listenTo(this.model.page, 'change:' + this.options.disableMarginScrollingPropertyName, function(model, disabled) {
      if (disabled) {
        this.$el.linkmapLookaround('disable');
      }
      else {
        this.$el.linkmapLookaround('enable');
      }
    });

    return this;
  }
});