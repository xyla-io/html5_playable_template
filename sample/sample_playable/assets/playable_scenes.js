(function() {
  function Scene(stage, config, delegate) {
    this.stage = stage;
    this.config = config;
    this.delegate = delegate;
  }

  Object.defineProperty(Scene.prototype, 'preloadManifest', {
    get() { return []; },
  });

  Scene.prototype.setup = function(props) {};
  Scene.prototype.tearDown = function() {
    return new Promise((resolve, reject) => resolve({}));
  };

  Scene.prototype.checkIntersection = function(rect1, rect2) {
    return !(rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x || rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y);
  };
  function FirstScene(stage, config, delegate) {
    Scene.apply(this, arguments);
  }

  FirstScene.prototype = Object.create(Scene.prototype);
  FirstScene.prototype.constructor = FirstScene;

  Object.defineProperty(FirstScene.prototype, 'preloadManifest', {
    get() {
      let manifest = [
        { id: 'Sample', src: 'sample.png' },
      ];
      return manifest;
    },
  });

  FirstScene.prototype.setup = function(props) {
    // Load a bitmap and make it invisible
    console.log('setup');
    this.sample = new createjs.Bitmap(playable.Preloader.shared.getResult('Sample'));
    this.stage.addChild(this.sample);
    this.sample.alpha = 0;

    // End the scene if the bitmap is clicked (note that assets with
    // transparency must be clicked on non-transparent parts)
    this.sample.on('click', () => {
      this.delegate.sceneDelegateSceneShouldEnd(this)
    });
    console.log(this.stage);

    // Create a fade-in effect on the bitmap
    let timeline = new createjs.Timeline();
    let fadeIn = shape => timeline.addTween(createjs.Tween.get(shape).to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(4)));
    fadeIn(this.sample);

    // End the scene after 10 seconds if the user doesn't interact
    this.checkForInteractionTimeout = setTimeout(() => {
      this.delegate.sceneDelegateSceneShouldEnd(this);
    }, 10000);
    playable.dimensions(this, 'FirstScene', 'setup');
  };

  FirstScene.prototype.tearDown = function() {
    clearTimeout(this.checkForInteractionTimeout);
    this.sample.off('click');
    return new Promise(resolve => {
      let timeline = new createjs.Timeline({
        'onComplete': () => {
          resolve({ sample: this.sample });
        }
      });
      // Scale up the bitmap when the scene ends
      let grow = shape => timeline.addTween(createjs.Tween.get(shape).to({ scaleX: 1.5, scaleY: 1.5 }, 1000, createjs.Ease.getPowInOut(4)));
      grow(this.sample);
    });
  };

  function SecondScene(stage, config, delegate) {
    Scene.apply(this, arguments);
  };

  SecondScene.prototype = Object.create(Scene.prototype);
  SecondScene.prototype.constructor = SecondScene;

  Object.defineProperty(SecondScene.prototype, 'preloadManifest', {
    get() {
      return [];
    },
  });

  SecondScene.prototype.setup = function(props) {
    this.sample = props.sample;
    // Conclude the playable when bitmap is clicked
    this.sample.on('click', () => this.delegate.sceneDelegateStoryShouldEnd(this));
    playable.dimensions(this, 'SecondScene', 'setup');
  };

  SecondScene.prototype.tearDown = function() {
    return new Promise.resolve({});
  };

  playable.FirstScene = FirstScene;
  playable.SecondScene = SecondScene;
})();
