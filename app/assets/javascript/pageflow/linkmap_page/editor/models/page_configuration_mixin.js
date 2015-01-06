pageflow.linkmapPage.pageConfigurationMixin = {
  linkmapAreas: function() {
    var configuration = this;

    this._linkmapAreas = this._linkmapAreas || create();
    return this._linkmapAreas;

    function create() {
      var collection = new pageflow.linkmapPage.AreasCollection();

      collection.add(configuration.get('linkmap_areas'));

      configuration.listenTo(collection, 'add remove change', function() {
        configuration.set('linkmap_areas', collection.map(function(area) {
          return _.clone(area.attributes);
        }));
      });

      return collection;
    }
  }
};