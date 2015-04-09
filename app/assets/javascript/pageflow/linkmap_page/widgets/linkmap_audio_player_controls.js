(function($) {
  $.widget('pageflow.linkmapAudioPlayerControls', {
    _create: function() {
      var widget = this;

      this.wrapper = $('<div />')
        .addClass('linkmap_audio_player_controls')
        .appendTo(this.element);

      this.playButton = $('<div />')
        .addClass('play')
        .text('Play')
        .appendTo(this.wrapper)
      ;

      this.pauseButton = $('<div />')
        .addClass('pause')
        .text('Pause')
        .appendTo(this.wrapper)
      ;

      this.progressElement = $('<div />')
        .addClass('progress')
        .appendTo(this.wrapper)
      ;

      this.currentTimeElement = $('<div />')
        .addClass('current_time')
        .appendTo(this.wrapper)
      ;

      this.durationElement = $('<div />')
        .addClass('duration')
        .appendTo(this.wrapper)
      ;

      this.playButton.on('click', function() {
        widget._trigger('play', null, {
          audioFileId: widget.element.data('audioFile')
        });
      });

      this.pauseButton.on('click', function() {
        widget._trigger('pause', null, {
          audioFileId: widget.element.data('audioFile')
        });
      });

      this.progressElement.on('click', function() {
        widget._trigger('seek', null, {
          position: 0,
          audioFileId: widget.element.data('audioFile')
        });
      });
    },

    playing: function() {
      this.wrapper.addClass('playing');
    },

    notPlaying: function() {
      this.wrapper.removeClass('playing');
    },

    updateProgress: function(player) {
      this.currentTimeElement.text(player.formatTime(player.position()));
      this.durationElement.text(player.formatTime(player.duration()));

      var percent = player.duration() > 0 ? player.position() / player.duration() * 100 : 0;
      this.progressElement.text(percent + '%');
    },

    refresh: function() {
    }
  });
}(jQuery));