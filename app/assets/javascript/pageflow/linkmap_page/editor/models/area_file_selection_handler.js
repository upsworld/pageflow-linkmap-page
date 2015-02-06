pageflow.linkmapPage.AreaFileSelectionHandler = function(options) {
  var page = pageflow.pages.get(options.id);
  var area = page.configuration.linkmapAreas(options.areasPropertyName).at(parseInt(options.areaIndex, 10));

  this.call = function(file) {
    area.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/linkmap_pages/' + options.id + '/audio_file_areas/' + options.areaIndex;
  };
};
