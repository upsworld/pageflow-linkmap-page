require 'pageflow/linkmap_page/engine'

module Pageflow
  module LinkmapPage
    def self.plugin
      LinkmapPage::Plugin.new
    end

    def self.page_type
      LinkmapPage::PageType.new
    end
  end
end
