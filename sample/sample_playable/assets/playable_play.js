try {
  if (module.exports !== undefined) {
    var playable = require('./playable');
  }
} catch (e) {}

(function() {
  playable.play = function(completion) {
    playable.Preloader.shared = new playable.Preloader;
    let stage = new createjs.Stage('playable-canvas');
    this.story = new playable.Story(stage, completion, playable.Preloader.shared);
    let scenes = [
      new playable.context.FirstScene(stage, playable.SceneConfiguration.shared, this.story),
      new playable.context.SecondScene(stage, playable.SceneConfiguration.shared, this.story),
    ];
    let background = undefined;
    this.story.tell(background, scenes);
  };

  playable.playScenes = function({scenes, canvasID = 'playable-canvas', completion = null, background = undefined, preloader = undefined}) {
    let stage = new createjs.Stage(canvasID);
    let story = new playable.Story(stage, completion, preloader);

    let sceneInstances = scenes.map(sceneClass => new sceneClass(stage, playable.SceneConfiguration.shared, story));

    story.tell(background, sceneInstances);
    return story;
  };
})();
