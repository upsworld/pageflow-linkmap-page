pageflow.linkmapPage.FileAreasView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/file_areas',
  className: 'linkmap_page_file_areas',

  ui: {
    areas: 'ul.areas'
  },

  events: {
    'click .add_area': function() {
      pageflow.editor.selectFile('audio_files', 'linkmapPage.newArea', {
        id: this.model.getRoutableId(),
        areasPropertyName: this.options.propertyName
      });

      return false;
    }
  },

  onRender: function() {
    var areas = this.model.linkmapAreas(this.options.propertyName);

    this.subview(new pageflow.CollectionView({
      el: this.ui.areas,
      collection: areas,
      itemViewConstructor: pageflow.linkmapPage.FileAreaItemView
    }));
  }
});