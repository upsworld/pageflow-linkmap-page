//= require ./area

pageflow.linkmapPage.AudioFileArea = pageflow.linkmapPage.Area.extend({
  mixins: [pageflow.transientReferences],

  targetFile: function() {
    return pageflow.audioFiles.get(this.get('audio_file_id'));
  },

  editPath: function() {
    var areaIndex = this.collection.indexOf(this);
    return '/linkmap_pages/' + this.getRoutableId() + '/audio_file_areas/' + areaIndex;
  }
});