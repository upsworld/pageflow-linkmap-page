//= require ./area

pageflow.linkmapPage.PageLinkArea = pageflow.linkmapPage.Area.extend({
  targetPage: function() {
    return pageflow.pages.getByPermaId(this.get('target_page_id'));
  },

  editPath: function() {
    var areaIndex = this.collection.indexOf(this);
    return '/linkmap_pages/' + this.getRoutableId() + '/page_link_areas/' + areaIndex;
  }
});