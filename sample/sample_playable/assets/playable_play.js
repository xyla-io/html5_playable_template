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
      new playable.context.FirstScene(stage, playable.SceneConfiguration.shared, this.story),
      new playable.context.SecondScene(stage, playable.SceneConfiguration.shared, this.story),
    ];
    let background = undefined;
    this.story.tell(background, scenes);
  };

  playable.playScenes = function({scenes, canvasID = 'playable-canvas', completion = null, background = undefined, preloader = undefined}) {
    let stage = new createjs.Stage(canvasID);
    let story = new playable.Story(stage, completion);
    story.tell(background, scenes);
    return story;
  };
})();
