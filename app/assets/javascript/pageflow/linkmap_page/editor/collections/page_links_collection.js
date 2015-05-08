pageflow.linkmapPage.PageLinksCollection = pageflow.SubsetCollection.extend({
  constructor: function(options) {
    this.areas = options.areas;

    pageflow.SubsetCollection.prototype.constructor.call(this, {
      parent: options.areas,

      filter: function(area) {
        return area.get('target_type') === 'page';
      }
    });
  },

  canAddLink: function() {
    return this.areas.canAddLink();
  },

  addLink: function(targetPageId) {
    this.areas.addLink(targetPageId);
  },

  updateLink: function(link, targetPageId) {
    link.set({target_id: targetPageId});
  },

  removeLink: function(link) {
    this.remove(link);
  },
});