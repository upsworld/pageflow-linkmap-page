module Pageflow
  module LinkmapPage
    module AreasHelper
      include BackgroundImageHelper

      def linkmap_areas_div(configuration, attribute_name)
        render('pageflow/linkmap_page/areas/div', configuration: configuration, attribute_name: attribute_name)
      end

      def linkmap_area(attributes, &block)
        Link.new(self, attributes.symbolize_keys).render(&block)
      end

      class Link < Struct.new(:template, :attributes)
        delegate :content_tag, to: :template

        def render(&block)
          content_tag(:a,
                      '',
                      href: '#',
                      class: css_classes,
                      style: inline_styles,
                      data: data_attributes,
                      &block)
        end

        private

        def data_attributes
          {
            audio_file: attributes[:audio_file_id],
            page: attributes[:target_page_id],
            page_transition: attributes[:page_transition],
            width: attributes[:width],
            height: attributes[:height]
          }
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
