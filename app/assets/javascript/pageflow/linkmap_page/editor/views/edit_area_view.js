pageflow.linkmapPage.EditAreaView = Backbone.Marionette.Layout.extend({
  template: 'pageflow/linkmap_page/editor/templates/edit_area',

  regions: {
    formContainer: '.form_container'
  },

  ui: {
    backButton: 'a.back'
  },

  events: {
    'click a.back': 'goBack'
  },

  onRender: function() {
    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: this.model
    });

    configurationEditor.tab('general', function() {
      this.input('name', pageflow.TextInputView);
      this.input('target_page_id', pageflow.PageLinkInputView);
    });

    this.formContainer.show(configurationEditor);
    this.model.set('highlighted', true);
  },

  onClose: function() {
    this.model.unset('highlighted');
  },

  goBack: function() {
    pageflow.editor.navigate('/pages/' + this.options.page.id + '/links', {trigger: true});
  }
});