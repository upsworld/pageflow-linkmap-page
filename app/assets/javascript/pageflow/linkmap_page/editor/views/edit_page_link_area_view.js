//= require ./edit_area_view

pageflow.linkmapPage.EditPageLinkAreaView = pageflow.linkmapPage.EditAreaView.extend({
  configure: function(configurationEditor) {
    configurationEditor.tab('general', function() {
      this.input('name', pageflow.TextInputView);
      this.input('target_page_id', pageflow.PageLinkInputView);
      this.input('page_transition', pageflow.SelectInputView, {
        translationKeyPrefix: 'pageflow.page_transitions',
        includeBlank: true,
        blankTranslationKey: 'pageflow.linkmap_page.default_page_transition',
        values: pageflow.pageTransitions.names()
      });
    });
  }
});