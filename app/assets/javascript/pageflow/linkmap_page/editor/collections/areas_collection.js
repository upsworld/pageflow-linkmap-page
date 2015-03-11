pageflow.linkmapPage.AreasCollection = Backbone.Collection.extend({
  model: pageflow.linkmapPage.Area,

  initialize: function(models, options) {
    this.page = options.page;
    this.defaultPosition = {
      left: 10,
      top: 10
    };
  },

  /**
   * @param [Object, Function] value
   */
  setDefaultPosition: function(value) {
    this.defaultPosition = value;
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
    this.add(_.extend(
      {width: 7, height: 7},
      _.result(this, 'defaultPosition'),
      attributes
    ));
  },

  updateLink: function(link, targetPageId) {
    link.set({target_page_id: targetPageId});
  },

  removeLink: function(link) {
    this.remove(link);
  },
});