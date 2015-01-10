pageflow.linkmapPage.SideBarRouter = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    'linkmap_pages/:pageId/areas/:index': 'area'
  }
});