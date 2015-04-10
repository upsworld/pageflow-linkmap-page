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
      this.input('marker', pageflow.SelectInputView, {values: pageflow.linkmapPage.toggleMarkerOptions});
      this.input('link_title', pageflow.TextInputView);
      this.input('link_description', pageflow.TextAreaInputView, {size: 'short'});
    });
  }
});