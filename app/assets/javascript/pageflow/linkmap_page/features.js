pageflow.features.register('slideshow', 'page_type.linkmap_page', function() {
  pageflow.linkmapPage.visitedPages = [];

  pageflow.events.on('page:change', function(page) {
    if (pageflow.linkmapPage.visitedPages.indexOf(page.getPermaId()) < 0) {
      pageflow.linkmapPage.visitedPages.push(page.getPermaId());
    }
  });
});