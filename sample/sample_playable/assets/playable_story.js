try {
  if (module.exports !== undefined) {
    var playable = require('./playable');
  }
} catch (e) {}

(function() {
  function Story(stage, completion, preloader, onEvent) {
    this.completion = completion;
    this.onEvent = onEvent;
    this.stage = stage;
    this.isWaitingForPreloadToAdvanceScene = false;
    this.preloader = preloader || new playable.Preloader;
  };
  
  Story.prototype.setBackground = function(image) {
    if (this.background) {
      this.stage.removeChild(this.background);
    }
    if (!image) { return; }
    this.background = new createjs.Bitmap(image);
    let hitArea = new createjs.Shape();
    hitArea.graphics.beginFill('#000').drawRect(0, 0, 320, 480);
    this.background.hitArea = hitArea;
    this.stage.addChildAt(this.background, 0);
  };

  Story.prototype.tell = function(background, scenes) {
    this.setBackground(background);
    this.stage.update();
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener('tick', this.stage);
    this.scenes = scenes;
    this.preloadedScenes = [];
    this.currentScene = null;
    this.preloadScene(this.scenes[0]).then(() => this.advanceSceneWhenReady());
  };

  Story.prototype.preloadScene = function(scene) {
    let manifest = scene.preloadManifest;
    if (!manifest.length) {
      this.preloadedScenes.push(scene);
      return new Promise((resolve, reject) => resolve(scene));
    }
    return this.preloader.loadManifest(manifest)
      .then(() => {
        this.preloadedScenes.push(scene);
        return scene;
      });
  };

  Story.prototype.advanceSceneWhenReady = function() {
    let currentSceneIndex = (this.currentScene !== null) ? this.scenes.indexOf(this.currentScene) : null;
    let nextSceneIndex = (currentSceneIndex !== null) ? currentSceneIndex + 1 : 0;
    if (nextSceneIndex === this.scenes.length) {
      this.completion();
      return;
    }
    let nextScene = this.scenes[nextSceneIndex];
    if (this.preloadedScenes.indexOf(nextScene) === -1) {
      this.isWaitingForPreloadToAdvanceScene = true;
      return;
    }

    if (this.currentScene !== null) {
      this.currentScene.tearDown().then(props => this.advanceScene(nextScene, props));
    } else {
      this.advanceScene(nextScene, {});
    }
  };

  Story.prototype.advanceScene = function(nextScene, props) {
    nextScene.setup(props);
    this.currentScene = nextScene;
    let followingSceneIndex = this.scenes.indexOf(nextScene) + 1;
    if (followingSceneIndex < this.scenes.length) {
      this.preloadScene(this.scenes[followingSceneIndex]).then(() => {
        if (this.isWaitingForPreloadToAdvanceScene) {
          this.isWaitingForPreloadToAdvanceScene = false;
          this.advanceSceneWhenReady();
        }
      });
    }
  };

  Story.prototype.sendEvent = function(event) {
    if (!this.currentScene) { return; }
    this.currentScene.onEvent(event);
  }

  Story.prototype.sceneDelegateGetPreloader = function(scene) {
    return this.preloader;
  };

  Story.prototype.sceneDelegateEmitEvent = function(scene, event) {
    if (!this.onEvent) { return; }
    this.onEvent(event);
  };

  Story.prototype.sceneDelegateSceneShouldEnd = function(scene) {
    if (scene !== this.currentScene) { return; }
    this.advanceSceneWhenReady();
  };

  Story.prototype.sceneDelegateStoryShouldEnd = function(scene) {
    if (!this.completion) { return; }
    this.completion();
  };

  playable.Story = Story;
})();
