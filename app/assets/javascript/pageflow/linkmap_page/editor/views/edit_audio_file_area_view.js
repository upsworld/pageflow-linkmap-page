//= require ./edit_area_view

pageflow.linkmapPage.EditAudioFileAreaView = pageflow.linkmapPage.EditAreaView.extend({
  configure: function(configurationEditor) {
    var view = this;

    configurationEditor.tab('general', function() {
      this.input('name', pageflow.TextInputView);
      this.input('audio_file_id', pageflow.FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'linkmapPage.area',
        fileSelectionHandlerOptions: {
          areasPropertyName: view.options.areasPropertyName,
          areaIndex: view.options.areaIndex,
        },
      });
    });
  }
});