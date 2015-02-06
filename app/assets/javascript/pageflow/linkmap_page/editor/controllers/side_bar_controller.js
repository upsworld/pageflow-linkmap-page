pageflow.linkmapPage.SideBarController = Backbone.Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
  },

  pageLinkArea: function(pageId, areaIndex) {
    this.area(pageId,
              areaIndex,
              'linkmap_page_link_areas',
              pageflow.linkmapPage.EditPageLinkAreaView);
  },

  audioFileArea: function(pageId, areaIndex) {
    this.area(pageId,
              areaIndex,
              'linkmap_audio_file_areas',
              pageflow.linkmapPage.EditAudioFileAreaView);
  },

  area: function(pageId, areaIndex, propertyName, editViewConstructor) {
    var page = pageflow.pages.get(pageId);

    this.region.show(new editViewConstructor({
      model: page.configuration.linkmapAreas(propertyName).at(parseInt(areaIndex, 10)),
      page: page,
      areasPropertyName: propertyName,
      areaIndex: areaIndex
    }));
  }
});