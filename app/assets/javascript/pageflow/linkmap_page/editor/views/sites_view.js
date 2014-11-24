pageflow.linkmapPage.SitesView = Backbone.Marionette.ItemView.extend({
  className: 'manage_linkmap_page_links',
  template: 'pageflow/linkmap_page/editor/templates/sites',

  events: {
    'click .add': function() {
      var site = pageflow.linkmapPage.sites.create({title: ''});
      var options = this.options;

      site.once('sync', function() {
        var query = options.page ? '/?page=' + options.page.id + '&return_to=sites' : '';
        pageflow.editor.navigate('linkmap_page/sites/' + site.id + query, {trigger: true});
      });
    }
  },

  onRender: function() {
    pageflow.linkmapPage.sites.ensureFetched();

    this.$el.append(this.subview(new pageflow.CollectionView({
      tagName: 'ul',
      className: 'sites',
      collection: pageflow.linkmapPage.sites,
      itemViewConstructor: pageflow.linkmapPage.SiteItemView,
      itemViewOptions: {
        selectionHandler: this.options.selectionHandler,
        referer: this.options.referer,
        page: this.options.page
      },
      blankSlateViewConstructor: Backbone.Marionette.ItemView.extend({
        template: 'pageflow/linkmap_page/editor/templates/sites_blank_slate'
      })
    })).el);
  }
});
