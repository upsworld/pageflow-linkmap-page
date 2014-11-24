module Pageflow
  module LinkmapPage
    class PageType < Pageflow::PageType
      name 'linkmap_page'

      def revision_components
        [Site]
      end

      def view_helpers
        [SitesHelper]
      end
    end
  end
end
