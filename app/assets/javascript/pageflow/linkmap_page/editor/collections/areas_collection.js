pageflow.linkmapPage.AreasCollection = Backbone.Collection.extend({
  model: pageflow.linkmapPage.Area,

  initialize: function(models, options) {
    this.page = options.page;
  },

  canAddLink: function() {
    return true;
  },

  addLink: function(targetPageId) {
    var offset = 10;

    this.add({
      target_page_id: targetPageId,
      left: offset + 2,
      top: 2,
      width: 5,
      height: 5
    });
  },

  updateLink: function(link, targetPageId) {
  },

  removeLink: function(link) {
    this.remove(link);
  },
});