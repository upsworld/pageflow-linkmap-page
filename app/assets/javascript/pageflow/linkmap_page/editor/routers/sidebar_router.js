pageflow.linkmapPage.SidebarRouter = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    'linkmap_page/sites': 'sites',
    'linkmap_page/sites?page=:page_id': 'sites',
    'linkmap_page/sites/:id': 'site',
    'linkmap_page/sites/:id/?page=:page_id&return_to=:return_to': 'site',
  }
});