pageflow.editor.registerPageConfigurationMixin(pageflow.linkmapPage.pageConfigurationMixin);

pageflow.editor.registerSideBarRouting({
  router: pageflow.linkmapPage.SidebarRouter,
  controller: pageflow.linkmapPage.SidebarController
});

pageflow.editor.registerFileSelectionHandler('linkmapPage.site', pageflow.linkmapPage.SiteFileSelectionHandler);

pageflow.editor.registerMainMenuItem({
  translationKey: 'pageflow.linkmap_page.manage_sites',
  path: '/linkmap_page/sites'
});

pageflow.editor.addInitializer(function() {
  pageflow.linkmapPage.sites = new pageflow.linkmapPage.SitesCollection();
});
