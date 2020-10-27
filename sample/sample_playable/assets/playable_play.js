try {
  if (module.exports !== undefined) {
    var playable = require('./playable');
  }
} catch (e) {}

(function() {
  playable.play = function(completion) {
    playable.Preloader.shared = new playable.Preloader;
    let stage = new createjs.Stage('playable-canvas');
    this.story = new playable.Story(stage, completion);
    let scenes = [
      new playable.FirstScene(stage, playable.SceneConfiguration.shared, this.story),
      new playable.SecondScene(stage, playable.SceneConfiguration.shared, this.story),
    ];
    let background = undefined;
    this.story.tell(background, scenes);
  }
})();
