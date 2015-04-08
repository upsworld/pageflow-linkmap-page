pageflow.linkmapPage.FileAreaItemView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/file_area_item',

  tagName: 'li',
  className: 'linkmap_page_file_area',

  ui: {
    thumbnail: '.file_thumbnail',
    title: '.title',
    label: '.label',
    editButton: '.edit'
  },

  events: {
    'click .edit': function() {
      pageflow.editor.navigate(this.model.editPath(), {trigger: true});
      return false;
    },

    'mouseenter': function() {
      this.model.highlight();
    },

    'mouseleave': function() {
      this.model.resetHighlight();
    }
  },

  onRender: function() {
    var file = this.model.targetFile();

    if (file) {
      this.subview(new pageflow.FileThumbnailView({
        el: this.ui.thumbnail,
        model: file
      }));

      this.ui.title.text(file.get('file_name'));
    }
    else {
      this.ui.title.text(I18n.t('pageflow.linkmap_page.editor.views.file_area_item_view.no_file'));
    }

    this.ui.label.text(this.model.label());
    this.ui.label.toggle(!!this.model.label());
    this.ui.editButton.toggle(!!this.model.editPath());

    this.$el.toggleClass('dangling', !file);
  },

  onClose: function() {
    this.model.resetHighlight();
  }
});