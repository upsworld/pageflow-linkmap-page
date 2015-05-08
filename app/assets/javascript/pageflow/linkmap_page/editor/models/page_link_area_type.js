pageflow.linkmapPage.PageLinkAreaType = Backbone.Model.extend({
  defaults: function() {
    return {
      label: I18n.t('pageflow.linkmap_page.editor.area_types.page')
    };
  },

  initialize: function(attributes, options) {
    this.areas = options.pageConfiguration.linkmapAreas();

    this.listenTo(this.areas, 'add remove', function() {
      this.updateDisabled();
    });

    this.updateDisabled();
  },

  updateDisabled: function() {
    this.set('disabled', !this.areas.canAddLink());
  },

  selected: function() {
    var areas = this.areas;

    pageflow.editor.selectPage().then(function(page) {
      areas.addLink(page.get('perma_id'));
    });
  }
});