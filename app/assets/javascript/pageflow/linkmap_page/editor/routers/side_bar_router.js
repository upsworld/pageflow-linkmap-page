pageflow.linkmapPage.SideBarRouter = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    'linkmap_pages/:pageId/page_link_areas/:index': 'pageLinkArea',
    'linkmap_pages/:pageId/audio_file_areas/:index': 'audioFileArea'
  }
});