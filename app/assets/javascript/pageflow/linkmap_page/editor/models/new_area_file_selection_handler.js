pageflow.linkmapPage.NewAreaFileSelectionHandler = function(options) {
  var page = pageflow.pages.get(options.id);

  this.call = function(file) {
    page.configuration.linkmapAreas(options.areasPropertyName).add({
      audio_file_id: file.id,
      left: 22,
      top: 2,
      width: 5,
      height: 5
    });
  };

  this.getReferer = function() {
    return '/pages/' + options.id + '/areas';
  };
};
