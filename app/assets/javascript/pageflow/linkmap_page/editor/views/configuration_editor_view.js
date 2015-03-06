pageflow.linkmapPage.ConfigurationEditorView = pageflow.ConfigurationEditorView.extend({
  configure: function() {
    this.tab('general', function() {
      this.input('title', pageflow.TextInputView, {required: true});
      this.input('invert', pageflow.CheckBoxInputView);
    });

    this.tab('files', function() {
      this.input('background_type', pageflow.SelectInputView, {
        values: ['image', 'video'],
        ensureValueDefined: true
      });

      this.input('background_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false,
        visibleBinding: 'background_type',
        visibleBindingValue: 'image'
      });

      this.input('background_video_id', pageflow.FileInputView, {
        collection: pageflow.videoFiles,
        positioning: false,
        visibleBinding: 'background_type',
        visibleBindingValue: 'video'
      });

      this.input('hover_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });

      this.input('visited_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });

      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
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
