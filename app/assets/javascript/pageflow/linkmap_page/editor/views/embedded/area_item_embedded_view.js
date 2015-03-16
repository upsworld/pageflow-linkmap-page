pageflow.linkmapPage.AreaItemEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/embedded/area_item',

  className: 'hover_area',

  ui: {
    hoverImage: '.background_image'
  },

  events: {
    'click .edit': function() {
      pageflow.editor.navigate(this.model.editPath(), {trigger: true});
      return false;
    },

    'click': function() {
      if (this.$el.is('.editable .hover_area')) {
        return false;
      }
    }
  },

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    this.setupHoverImageView();
    this.setupDraggableAndResizable();

    this.update();
  },

  setupHoverImageView: function() {
    var hoverImageView = new pageflow.BackgroundImageEmbeddedView({
      el: this.ui.hoverImage,
      model: this.options.pageConfiguration,
      propertyName: 'hover_image_id'
    }).render();

    this.listenTo(this.options.pageConfiguration, 'change:hover_image_id', function() {
      hoverImageView.update();
    });
  },

  setupDraggableAndResizable: function() {
    var that = this;
    var scroller = this.options.container.$('.scroller');

    this.$el.resizable({
      handles: 'n, e, s, w, ne, se, sw, nw',

      start: function() {
        that.$el.addClass('hover editing');
        scroller.scroller('disable');

      },

      stop: function(event, ui) {
        that.$el.removeClass('hover editing');
        savePositionAndSize();
        scroller.scroller('enable');
      }
    });

    this.$el.draggable({
      iframeFix: true,

      start: function() {
        that.$el.addClass('hover editing');
        scroller.scroller('disable');
      },

      drag: function(event, ui) {
        that.ui.hoverImage.linkmapAreaImage(ui.position);
      },

      stop: function(event, ui) {
        that.$el.removeClass('hover editing');
        scroller.scroller('enable');
        savePositionAndSize();
      }
    }).css('position', 'absolute');

    function savePositionAndSize() {
      var element = that.$el;

      that.model.set({
        left: parseInt(element.css('left'), 10) / (element.parent().width() / 100),
        top: parseInt(element.css('top'), 10) / (element.parent().height() / 100),
        width: parseInt(element.css('width'), 10) / (element.parent().width() / 100),
        height: parseInt(element.css('height'), 10) / (element.parent().height() / 100)
      });
    }
  },

  update: function() {
    this.$el.attr('data-audio-file', this.model.get('audio_file_id'));
    this.$el.attr('data-page', this.model.get('target_page_id'));
    this.$el.attr('data-page-transition', this.model.get('page_transition'));

    this.$el.toggleClass('highlighted', !!this.model.get('highlighted'));

    this.$el.attr('data-width', this.model.get('width'));
    this.$el.attr('data-height', this.model.get('height'));

    this.$el.css('left', this.model.get('left') + '%');
    this.$el.css('top', this.model.get('top') + '%');
    this.$el.css('width', this.model.get('width') + '%');
    this.$el.css('height', this.model.get('height') + '%');
  }
});