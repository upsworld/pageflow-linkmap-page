class CreatePageflowLinkmapSites < ActiveRecord::Migration
  def change
    create_table :pageflow_linkmap_sites do |t|
      t.integer :perma_id
      t.belongs_to :revision, index: true

      t.string :url
      t.string :title
      t.string :thumbnail
      t.text :description
      t.boolean :open_in_new_tab

      t.timestamps
    end
  end
end
