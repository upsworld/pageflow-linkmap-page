pageflow.linkmapPage.SiteFileSelectionHandler = function(options) {
  this.call = function(file) {
    pageflow.linkmapPage.sites.ensureFetched().then(function() {
      var site = pageflow.linkmapPage.sites.get(options.id);
      site.setReference(options.attributeName, file);
    });
  };

  this.getReferer = function() {
    var query = (options.pageId && options.returnTo) ? '/?page=' + options.pageId + '&return_to=' + options.returnTo : '';
    return '/linkmapPage/sites/' + options.id + query;
  };
};