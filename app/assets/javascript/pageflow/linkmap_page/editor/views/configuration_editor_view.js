pageflow.linkmapPage.ConfigurationEditorView = pageflow.ConfigurationEditorView.extend({
  configure: function() {
    this.tab('general', function() {
      this.group('general');
      this.input('panorama_initial_position', pageflow.SliderInputView);
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

    this.tab('areas', function() {
      this.view(pageflow.PageLinksView, {
        model: this.model.page
      });
      this.view(pageflow.linkmapPage.EditableAreasModeView, {
        model: this.model.page
      });
      this.view(pageflow.linkmapPage.FileAreasView, {
        model: this.model,
        propertyName: 'linkmap_audio_file_areas'
      });
    });

    this.tab('options', function() {
      this.group('options');
    });
  }
});
