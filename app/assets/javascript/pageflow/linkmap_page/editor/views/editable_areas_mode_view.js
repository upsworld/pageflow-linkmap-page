pageflow.linkmapPage.EditableAreasModeView = Backbone.Marionette.View.extend({
  render: function() {
    this.model.set('areas_editable', true);
    return this;
  },

  onClose: function() {
    this.model.unset('areas_editable');
  }
});