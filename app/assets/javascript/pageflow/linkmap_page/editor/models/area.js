pageflow.linkmapPage.Area = Backbone.Model.extend({
  modelName: 'area',
  i18nKey: 'pageflow/linkmap_page/area',

  targetPage: function() {
    return pageflow.pages.getByPermaId(this.get('target_page_id'));
  },

  label: function() {
  },

  editPath: function() {
    var areaIndex = this.collection.indexOf(this);
    return '/linkmap_pages/' + this.collection.page.id + '/areas/' + areaIndex;
  },

  highlight: function() {

  },

  resetHighlight: function() {

  }
});