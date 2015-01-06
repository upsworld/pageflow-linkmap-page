pageflow.linkmapPage.AreasEmbeddedView = Backbone.Marionette.View.extend({
  render: function() {
    console.log("render", this.options.propertyName);
    this.subview(new pageflow.CollectionView({
      el: this.$el,
      collection: this.model.linkmapAreas(),
      itemViewConstructor: pageflow.linkmapPage.AreaItemEmbeddedView
    }));

    var view = this;

    this.listenTo(this.model.page, 'change:' + this.options.propertyName + '_editable', function() {
      view.updateClassName();
    });

    return this;
  },

  updateClassName: function() {
    var editable = this.model.page.get(this.options.propertyName + '_editable');

    this.$el.toggleClass('editable', !!editable);
  }

});