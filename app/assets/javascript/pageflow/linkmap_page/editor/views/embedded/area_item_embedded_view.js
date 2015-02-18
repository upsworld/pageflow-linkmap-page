pageflow.linkmapPage.AreaItemEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/linkmap_page/editor/templates/embedded/area_item',

  className: 'area_item',

  events: {
    'click .edit': function() {
      pageflow.editor.navigate(this.model.editPath(), {trigger: true});
      return false;
    },

    'click': function() {
      //
      //var targetPage = this.model.targetPage();
      //
      //if (targetPage &&
      //    !this.$el.parents('.linkmap_areas').hasClass('editable') &&
      //    !this.$el.hasClass('editable')) {
      //  pageflow.slides.goToByPermaId(targetPage.get('perma_id'));
      //}
    }
  },

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    var savePositionAndSize = function(element, model) {
      element.css("left",parseInt(element.css("left"), 10) / (element.parent().width() / 100)+"%");
      element.css("top",parseInt(element.css("top"), 10) / (element.parent().height() / 100)+"%");
      element.css("width",parseInt(element.css("width"), 10) / (element.parent().width() / 100)+"%");
      element.css("height",parseInt(element.css("height"), 10) / (element.parent().height() / 100)+"%");

      model.set({
        'left': parseInt(element.css("left"), 10) / (element.parent().width() / 100),
        'top': parseInt(element.css("top"), 10) / (element.parent().height() / 100),
        'width': parseInt(element.css("width"), 10) / (element.parent().width() / 100),
        'height': parseInt(element.css("height"), 10) / (element.parent().height() / 100)
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
    this.$el.attr('data-audio-file-id', this.model.get('audio_file_id'));

    this.$el.toggleClass('editable', !!this.model.get('highlighted'));

    this.$el.css('left', this.model.get('left') + "%");
    this.$el.css('top', this.model.get('top') + "%");
    this.$el.css('width', this.model.get('width') + "%");
    this.$el.css('height', this.model.get('height') + "%");
  }
});