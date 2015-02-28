module Pageflow
  module LinkmapPage
    class Plugin < Pageflow::Plugin
      def configure(config)
        config.features.register(PageTypeFeature.new(LinkmapPage.page_type))
      end
    end
  end
end
