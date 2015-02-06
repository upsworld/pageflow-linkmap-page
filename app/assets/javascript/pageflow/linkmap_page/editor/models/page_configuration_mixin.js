pageflow.linkmapPage.pageConfigurationMixin = {
  linkmapAreas: function(propertyName) {
    var configuration = this;
    var model = propertyName.indexOf('audio_file') >= 0 ? pageflow.linkmapPage.AudioFileArea : pageflow.linkmapPage.PageLinkArea;

    this._linkmapAreas = this._linkmapAreas || {};
    this._linkmapAreas[propertyName] = this._linkmapAreas[propertyName] || create();
    return this._linkmapAreas[propertyName];

    function create() {
      var collection = new pageflow.linkmapPage.AreasCollection(
        configuration.get(propertyName),
        {
          model: model,
          page: configuration.page
        }
      );

      configuration.listenTo(collection, 'add remove change', function() {
        configuration.set(propertyName, collection.map(function(area) {
          return _.omit(area.attributes, 'highlighted');
        }));
      });

      return collection;
    }
  }
};