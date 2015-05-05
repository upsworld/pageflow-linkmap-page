module Pageflow
  module LinkmapPage
    module AreasHelper
      include BackgroundImageHelper

      def linkmap_areas_div(entry, configuration, attribute_name)
        render('pageflow/linkmap_page/areas/div',
               entry: entry,
               configuration: configuration,
               attribute_name: attribute_name)
      end

      def linkmap_area(entry, attributes, index, &block)
        Link.new(self, entry, attributes.symbolize_keys, index).render(&block)
      end

      class Link < Struct.new(:template, :entry, :attributes, :index)
        delegate :content_tag, to: :template

        def render(&block)
          content_tag(:a,
                      '',
                      href: href,
                      class: css_classes,
                      style: inline_styles,
                      data: data_attributes,
                      &block)
        end

        private

        def href
          if attributes[:type] == 'external_site'
            site = ExternalLinks::Site.find_by_revision_id_and_perma_id(entry.try(:revision),
                                                                        attributes[:external_site_id])
            site ? site.url : '#'
          else
            '#'
          end
        end

        def data_attributes
          audio_file_id = attributes[:audio_file_id]

          {
            type: attributes[:type],
            audio_file: audio_file_id.present? ? "#{audio_file_id}.area_#{index}" : nil,
            page: attributes[:target_page_id],
            page_transition: attributes[:page_transition],
            width: attributes[:width],
            height: attributes[:height]
          }.delete_if { |key, value| value.blank? }
        end

        def inline_styles
          styles_string(top: in_percent(attributes[:top]),
                        left: in_percent(attributes[:left]),
                        width: in_percent(attributes[:width]),
                        height: in_percent(attributes[:height]))
        end

        def css_classes
          'hover_area' + ' ' + attributes[:marker].to_s
        end

        def styles_string(properties)
          properties.map do |name, value|
            "#{name}: #{value};"
          end.join(' ')
        end

        def in_percent(value)
          value ? "#{value}%" : ''
        end
      end
    end
  end
end
