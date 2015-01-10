pageflow.linkmapPage.SideBarController = Backbone.Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
  },

  area: function(pageId, areaIndex) {
    var page = pageflow.pages.get(pageId);

    this.region.show(new pageflow.linkmapPage.EditAreaView({
      model: page.configuration.linkmapAreas().at(parseInt(areaIndex, 10)),
      page: page
    }));
  }
});