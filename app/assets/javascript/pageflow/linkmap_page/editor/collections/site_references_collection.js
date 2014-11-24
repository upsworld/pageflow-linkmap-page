pageflow.linkmapPage.SiteReferencesCollection = Backbone.Collection.extend({
  model: pageflow.linkmapPage.SiteReference,

  comparator: function(chapter) {
    return chapter.get('position');
  },

  saveOrder: function() {
    // no op
  }
});