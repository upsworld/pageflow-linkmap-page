pageflow.linkmapPage.AreasEmbeddedView = Backbone.Marionette.View.extend({
  render: function() {
    this.subview(new pageflow.CollectionView({
      el: this.$el,
      collection: this.model.linkmapAreas(this.options.propertyName),
      itemViewConstructor: pageflow.linkmapPage.AreaItemEmbeddedView
    }));

    var view = this;

    this.listenTo(this.model.page, 'change:areas_editable', function() {
      view.updateClassName();
    });

    return this;
  },

  updateClassName: function() {
    var editable = this.model.page.get('areas_editable');

    this.$el.toggleClass('editable', !!editable);
  }

});