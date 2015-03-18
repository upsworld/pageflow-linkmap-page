pageflow.editor.pageTypes.register('linkmap_page', {
  configurationEditorView: pageflow.linkmapPage.ConfigurationEditorView,

  embeddedViews: {
    '.panorama_image': {
      view: pageflow.BackgroundImageEmbeddedView,
      options: {
        propertyName: 'panorama_image_id',
        dataSizeAttributes : true
      }
    },

    '.panorama_video': {
      view: pageflow.LazyVideoEmbeddedView,
      options: {
        propertyName: 'panorama_video_id',
        dataSizeAttributes: true
      }
    },

    '.linkmap_page_link_areas': {
      view: pageflow.linkmapPage.AreasEmbeddedView,
      options: {
        propertyName: 'linkmap_page_link_areas'
      }
    },

    '.linkmap_audio_file_areas': {
      view: pageflow.linkmapPage.AreasEmbeddedView,
      options: {
        propertyName: 'linkmap_audio_file_areas'
      }
    },

    '.fixed_background': {
      view: pageflow.BackgroundImageEmbeddedView,
      options: {propertyName: 'background_image_id'}
    }
  },

  pageLinks: function(configuration) {
    return configuration.linkmapAreas('linkmap_page_link_areas');
  }
});

pageflow.editor.registerPageConfigurationMixin(pageflow.linkmapPage.pageConfigurationMixin);

pageflow.editor.registerFileSelectionHandler('linkmapPage.area', pageflow.linkmapPage.AreaFileSelectionHandler);
pageflow.editor.registerFileSelectionHandler('linkmapPage.newArea', pageflow.linkmapPage.NewAreaFileSelectionHandler);

pageflow.editor.registerSideBarRouting({
  router: pageflow.linkmapPage.SideBarRouter,
  controller: pageflow.linkmapPage.SideBarController
});