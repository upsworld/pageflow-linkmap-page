pageflow.linkmapPage.AreaItemEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/embedded/area_item',

  className: 'area_item',

  ui: {
  },

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    var savePositionAndSize = function(element, model) {
      element.css("left",parseInt(element.css("left")) / (element.parent().width() / 100)+"%");
      element.css("top",parseInt(element.css("top")) / (element.parent().height() / 100)+"%");
      element.css("width",parseInt(element.css("width")) / (element.parent().width() / 100)+"%");
      element.css("height",parseInt(element.css("height")) / (element.parent().height() / 100)+"%");

      model.set({
        'left': parseInt(element.css("left")) / (element.parent().width() / 100),
        'top': parseInt(element.css("top")) / (element.parent().height() / 100),
        'width': parseInt(element.css("width")) / (element.parent().width() / 100),
        'height': parseInt(element.css("height")) / (element.parent().height() / 100)
      });
    },

    that = this;

    this.$el.resizable({
      handles: "n, e, s, w, ne, se, sw, nw",
      create: function() {
      },
      stop: function(event, ui) { savePositionAndSize($(that.$el), that.model); }
    });

    this.$el.draggable({
      iframeFix: true,
      stop: function(event, ui) { savePositionAndSize($(that.$el), that.model); }
    }).css('position', 'absolute');

    this.update();
  },

  update: function() {
    this.$el.css('left', this.model.get('left') + "%");
    this.$el.css('top', this.model.get('top') + "%");
    this.$el.css('width', this.model.get('width') + "%");
    this.$el.css('height', this.model.get('height') + "%");
  }
});