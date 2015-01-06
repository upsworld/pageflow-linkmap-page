pageflow.linkmapPage.AreaItemView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/area_item',

  tagName: 'li',
  className: 'linkmap_page_area',

  ui: {
  },

  events: {
    'click .remove': function() {
      this.model.destroy();
      return false;
    }
  },

  onRender: function() {
  },
});