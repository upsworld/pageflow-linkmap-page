pageflow.linkmapPage.ExternalLinkAreaType = Backbone.Model.extend({
  defaults: function() {
    return {
      label: I18n.t('pageflow.linkmap_page.editor.area_types.external_site'),
    };
  },

  initialize: function(attributes, options) {
    this.areas = options.pageConfiguration.linkmapAreas();
  },

  selected: function() {
    var areas = this.areas;

    pageflow.externalLinks.selectSite().then(function(site) {
      areas.addExternalSite(site.get('perma_id'));
    });
  }
});