pageflow.ConfigurationEditorView.register('linkmap_page', {
  configure: function() {
    this.tab('general', function() {
      this.group('general');
    });

    this.tab('files', function() {
      this.input('background_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        imagePositioning: false
      });
    });

    this.tab('links', function() {
      this.input('linked_linkmap_page_perma_ids', pageflow.externalLinks.SiteReferenceInputView);
    });


    this.tab('options', function() {
      this.group('options');
    });
  }
});
