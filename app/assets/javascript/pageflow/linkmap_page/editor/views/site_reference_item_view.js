pageflow.linkmapPage.SiteReferenceItemView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/site_reference_item',

  tagName: 'li',
  className: 'linkmap_page_site_reference',

  ui: {
    thumbnail: '.thumbnail',
    title: '.title'
  },

  events: {
    'click .remove': function() {
      this.model.destroy();
      return false;
    },

    'click .edit': function() {
      pageflow.editor.navigate('/linkmap_page/sites/' + this.model.get('site').id + '/?page=' + this.options.page.id + '&return_to=page', {trigger: true});
      return false;
    }
  },

  onRender: function() {
    this.subview(new pageflow.FileThumbnailView({
      el: this.ui.thumbnail,
      model: this.model.get('site').getThumbnail()
    }));

    this.ui.title.text(this.model.get('site').get('title') || '(Unbenannt)');
  },
});