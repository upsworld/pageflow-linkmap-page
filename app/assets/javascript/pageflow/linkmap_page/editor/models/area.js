pageflow.linkmapPage.Area = Backbone.Model.extend({
  modelName: 'area',
  i18nKey: 'pageflow/linkmap_page/area',

  label: function() {
  },

  highlight: function() {
    this.set('highlighted', true);
  },

  resetHighlight: function() {
    this.unset('highlighted');
  },

  getRoutableId: function() {
    return this.collection.page.id;
  }
});