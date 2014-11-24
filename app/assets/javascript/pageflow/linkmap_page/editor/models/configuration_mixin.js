pageflow.linkmapPage.pageConfigurationMixin = {
  linkmapPageReferences: function() {
    var configuration = this;

    this._linkmapPageReferences = this._linkmapPageReferences || create();
    return this._linkmapPageReferences;

    function create() {
      var collection = new pageflow.linkmapPage.SiteReferencesCollection();

      pageflow.linkmapPage.sites.ensureFetched().then(function() {
        collection.add(siteReferenceAttributes());

        configuration.listenTo(collection, 'add remove sort', function() {
          configuration.set('linked_linkmap_page_perma_ids', _.map(collection.pluck('site'), function(site) {
            return site.get('perma_id');
          }));
        });
      });

      return collection;
    }

    function siteReferenceAttributes() {
      return _.compact(_.map(referencedSitePermaIds(), function(permaId) {
        var site = pageflow.linkmapPage.sites.getByPermaId(permaId);

        return site && {
          site: site
        };
      }));
    }

    function referencedSitePermaIds() {
      return configuration.get('linked_linkmap_page_perma_ids') || [];
    }
  }
};