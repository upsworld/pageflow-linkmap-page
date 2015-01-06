module Pageflow
  module LinkmapPage
    class PageType < Pageflow::PageType
      name 'linkmap_page'

      def view_helpers
        [ImageTagHelper]
      end
    end
  end
end
