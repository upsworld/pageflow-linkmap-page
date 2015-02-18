module Pageflow
  module LinkmapPage
    class PageType < Pageflow::PageType
      name 'linkmap_page'

      def view_helpers
        [ImageTagHelper, AreasHelper]
      end
    end
  end
end
