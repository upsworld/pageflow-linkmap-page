pageflow.editor.pageTypes.register('linkmap_page', {
  configurationEditorView: pageflow.linkmapPage.ConfigurationEditorView,

  embeddedViews: {
    '.panorama': {
      view: pageflow.BackgroundImageEmbeddedView,
      options: {propertyName: 'background_image_id', dataSizeAttributes : true}
    },

    '.linkmap_areas': {
      view: pageflow.linkmapPage.AreasEmbeddedView,
      options: {propertyName: 'linked_page_ids'}
    }
  },

  pageLinks: function(configuration) {
    return configuration.linkmapAreas();
  }
});

pageflow.editor.registerPageConfigurationMixin(pageflow.linkmapPage.pageConfigurationMixin);
