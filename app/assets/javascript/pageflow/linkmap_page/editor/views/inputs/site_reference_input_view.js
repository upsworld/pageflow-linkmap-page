pageflow.linkmapPage.SiteReferenceInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/linkmap_page/editor/templates/inputs/site_reference',
  className: 'linkmap_page_site_reference_input',

  ui: {
    sites: 'ul.sites'
  },

  events: {
    'click .add_reference': function() {
      pageflow.editor.navigate(
        '/linkmap_page/sites?page=' + this.model.page.id,
        {trigger: true}
      );
      return false;
    }
  },

  onRender: function() {
    this.subview(new pageflow.SortableCollectionView({
      el: this.ui.sites,
      collection: this.model.linkmapPageReferences(),
      itemViewConstructor: pageflow.linkmapPage.SiteReferenceItemView,
      itemViewOptions: {
        page: this.model.page
      }
    }));
  }
});