pageflow.ConfigurationEditorView.register('linkmap_page', {
  configure: function() {
    this.tab('general', function() {
      this.group('general');
      this.input('panorama_initial_position', pageflow.SliderInputView);
    });

    this.tab('links', function() {
      this.input('linkmap_areas', pageflow.linkmapPage.AreasInputView);
    });

    this.tab('files', function() {
      this.input('background_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
      this.input('hover_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
      this.input('visited_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        imagePositioning: false
      });
    });

    this.tab('options', function() {
      this.group('options');
    });
  }
});
