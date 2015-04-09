(function($) {
  $.widget('pageflow.linkmapAudioPlayersController', {
    _create: function() {
      var player = this.options.player;

      this.delegatePlayerEvent('play', 'playing');
      this.delegatePlayerEvent('pause ended', 'notPlaying');
      this.delegatePlayerEvent('timeupdate', 'updateProgress');

      this.element.on('linkmapaudioplayercontrolsplay', function(event, options) {
        player.play(options.audioFileId);
      });

      this.element.on('linkmapaudioplayercontrolspause', function(event, options) {
        player.pause();
      });

      this.element.on('linkmapaudioplayercontrolsseek', function(event, options) {
      });
    },

    delegatePlayerEvent: function (event, method) {
      var element = this.element;
      var player = this.options.player;

      player.on(event, function(options) {
        var selector = '[data-audio-file="' + options.audioFileId + '"]';
        var playerElement = element.find(selector);

        playerElement.linkmapAudioPlayerControls(method, player);
      });
    }
  });
}(jQuery));