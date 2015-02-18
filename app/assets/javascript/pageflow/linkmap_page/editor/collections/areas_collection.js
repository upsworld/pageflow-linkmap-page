pageflow.linkmapPage.AreasCollection = Backbone.Collection.extend({
  model: pageflow.linkmapPage.Area,

  initialize: function(models, options) {
    this.page = options.page;
  },

  canAddLink: function() {
    return true;
  },

  addLink: function(targetPageId) {
    this.addWithPosition({
      target_page_id: targetPageId
    });
  },

  addAudioFile: function(audioFileId) {
    this.addWithPosition({
      audio_file_id: audioFileId
    });
  },

  addWithPosition: function(attributes) {
    this.add(_.extend({
      left: 10,
      top: 10,
      width: 7,
      height: 7
    }, attributes));
  },

  updateLink: function(link, targetPageId) {
  },

  removeLink: function(link) {
    this.remove(link);
  },
});