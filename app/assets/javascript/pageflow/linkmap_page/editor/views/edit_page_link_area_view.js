//= require ./edit_area_view

pageflow.linkmapPage.EditPageLinkAreaView = pageflow.linkmapPage.EditAreaView.extend({
  configure: function(configurationEditor) {
    configurationEditor.tab('general', function() {
      this.input('name', pageflow.TextInputView);
      this.input('target_page_id', pageflow.PageLinkInputView);
    });
  }
});