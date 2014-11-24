pageflow.linkmapPage.SiteSelectionHandler = function(options) {
  this.call = function(site) {
    options.page.configuration.linkmapPageReferences().add({
      site: site
    });
  };
};