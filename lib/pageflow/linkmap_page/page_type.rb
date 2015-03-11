module Pageflow
  module LinkmapPage
    class PageType < Pageflow::PageType
      name 'linkmap_page'

      def view_helpers
        [ImageTagHelper, AreasHelper]
      end

      def thumbnail_candidates
        [
          {attribute: 'thumbnail_image_id', file_collection: 'image_files'},
          {attribute: 'background_image_id', file_collection: 'image_files'},
          {attribute: 'background_video_id', file_collection: 'video_files'}
        ]
      end
    end
  end
end
