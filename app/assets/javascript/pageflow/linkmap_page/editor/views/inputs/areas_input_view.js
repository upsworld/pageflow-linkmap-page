pageflow.linkmapPage.AreasInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/linkmap_page/editor/templates/inputs/areas',
  className: 'linkmap_page_areas_input',

  ui: {
    areas: 'ul.areas'
  },

  events: {
    'click .add_area': function() {
      var offset = $("section[data-id='" + this.model.page.id + "']").find('.linkmap_areas').offset().left / $("section[data-id='" + this.model.page.id + "']").find('.linkmap_areas').width() * -100;

      this.model.linkmapAreas().add({left: offset + 2, top: 2, width: 5, height: 5});
      return false;
    }
  },

  onRender: function() {
    this.model.page.set('linked_page_ids_editable', true);

    this.subview(new pageflow.CollectionView({
      el: this.ui.areas,
      collection: this.model.linkmapAreas(),
      itemViewConstructor: pageflow.linkmapPage.AreaItemView
    }));
  },

  onClose: function() {
    this.model.page.unset('linked_page_ids_editable');
  }
});