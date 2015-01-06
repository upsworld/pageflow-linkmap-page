module Pageflow
  module LinkmapPage
    module ImageTagHelper
      def linkmap_page_site_css_class(site)
        ['link-item', site.title.blank? && site.description.blank? ? 'no_text' : ''].compact.join(' ')
      end


      def linkmap_page_site_thumbnail_css_class(site)
        classes = ['link-thumbnail']

        if file = site.thumbnail_file
          classes << file_thumbnail_css_class(file, :link_thumbnail_large)
        end

        classes.join(' ')
      end

      def linkmap_image_tag(image_id, options = {})
        if image = ImageFile.find_by_id(image_id)
          options = options.merge(:'data-printsrc' => image.attachment.url(:original))
          image_tag(image.attachment.url(:original), options)
        end
      end
    end
  end
end
