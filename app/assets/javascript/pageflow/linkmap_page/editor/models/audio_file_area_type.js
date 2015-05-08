pageflow.linkmapPage.AudioFileAreaType = Backbone.Model.extend({
  defaults: function() {
    return {
      label: I18n.t('pageflow.linkmap_page.editor.area_types.audio_file')
    };
  },

  initialize: function(attributes, options) {
    this.pageId = options.pageConfiguration.getRoutableId();
  },

  selected: function() {
    pageflow.editor.selectFile('audio_files', 'linkmapPage.newArea', {
      id: this.pageId
    });
  }
});