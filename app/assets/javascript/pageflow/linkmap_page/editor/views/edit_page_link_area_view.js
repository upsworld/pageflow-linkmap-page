//= require ./edit_area_view

pageflow.linkmapPage.EditPageLinkAreaView = pageflow.linkmapPage.EditAreaView.extend({
  configure: function(configurationEditor) {
    configurationEditor.tab('general', function() {
      this.input('name', pageflow.TextInputView);

      this.input('type', pageflow.SelectInputView, {
        values: ['page_link', 'external_site'],
        ensureValueDefined: true
      });

      this.input('target_page_id', pageflow.PageLinkInputView, {
        visibleBinding: 'type',
        visibleBindingValue: 'page_link'
      });

      this.input('page_transition', pageflow.SelectInputView, {
        translationKeyPrefix: 'pageflow.page_transitions',
        includeBlank: true,
        blankTranslationKey: 'pageflow.linkmap_page.default_page_transition',
        values: pageflow.pageTransitions.names(),
        visibleBinding: 'type',
        visibleBindingValue: 'page_link'
      });

      this.input('external_site_id', pageflow.externalLinks.SiteReferenceInputView, {
        visibleBinding: 'type',
        visibleBindingValue: 'external_site'
      });

      this.input('marker', pageflow.SelectInputView, {values: pageflow.linkmapPage.toggleMarkerOptions});
      this.input('link_title', pageflow.TextInputView);
      this.input('link_description', pageflow.TextAreaInputView, {size: 'short'});
    });
  }
});