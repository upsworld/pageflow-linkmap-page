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
    var view = this;
    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: this.model
    });

    this.configure(configurationEditor);

    this.formContainer.show(configurationEditor);
    this.model.set('highlighted', true);
  },

  configure: function(configurationEditor) {},

  onClose: function() {
    this.model.unset('highlighted');
  },

  goBack: function() {
    pageflow.editor.navigate('/pages/' + this.options.page.id + '/areas', {trigger: true});
  }
});