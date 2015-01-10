pageflow.linkmapPage.EditableAreasModeView = Backbone.Marionette.View.extend({
  render: function() {
    this.model.set('linked_page_ids_editable', true);
    return this;
  },

  onClose: function() {
    this.model.unset('linked_page_ids_editable');
  }
});