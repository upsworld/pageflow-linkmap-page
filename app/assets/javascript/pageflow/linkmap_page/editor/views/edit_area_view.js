pageflow.linkmapPage.EditAreaView = Backbone.Marionette.Layout.extend({
  template: 'pageflow/linkmap_page/editor/templates/edit_area',

  regions: {
    formContainer: '.form_container'
  },

  ui: {
    backButton: 'a.back'
  },

  events: {
    'click a.back': 'goBack',

    'click a.destroy': 'destroy'
  },

  onRender: function() {
    var view = this;
    var area = this.model;
    var areaCollection = this.model.collection;
    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: this.model
    });

    this.configure(configurationEditor);

    this.formContainer.show(configurationEditor);
    this.model.set('highlighted', true);
    this.model.collection.page.set('areas_editable', true);

    this.on('close', function() {
      area.unset('highlighted');
      areaCollection.page.unset('areas_editable');
    });
  },

  configure: function(configurationEditor) {},

  destroy: function() {
    if (confirm(I18n.t('pageflow.linkmap_page.editor.views.edit_area_view.confirm_destroy'))) {
      this.model.remove();
      this.goBack();
    }
  },

  goBack: function() {
    pageflow.editor.navigate('/pages/' + this.options.page.id + '/areas', {trigger: true});
  }
});