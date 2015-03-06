pageflow.linkmapPage.ConfigurationEditorView = pageflow.ConfigurationEditorView.extend({
  configure: function() {
    this.tab('general', function() {
      this.input('title', pageflow.TextInputView, {required: true});
      this.input('invert', pageflow.CheckBoxInputView);
    });

    this.tab('files', function() {
      this.input('panorama_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
      this.input('hover_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
      this.input('visited_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });
      this.input('background_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
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
