(function () {
  function FirstScene(stage, config, delegate) {
    playable.Scene.apply(this, arguments);
  }

  FirstScene.prototype = Object.create(playable.Scene.prototype);
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
    this.sample = new createjs.Bitmap(this.delegate.preloader.getResult('Sample'));
    this.stage.addChild(this.sample);
    this.sample.alpha = 0;

    // End the scene if the bitmap is clicked (note that assets with
    // transparency must be clicked on non-transparent parts)
    this.sample.on('click', () => {
      this.delegate.sceneDelegateSceneShouldEnd(this)
    });

    // Create a fade-in effect on the bitmap
    let timeline = new createjs.Timeline();
    let fadeIn = shape => timeline.addTween(createjs.Tween.get(shape).to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(4)));
    fadeIn(this.sample);

    // Create a bounce animation on the bitmap
    const bounceRange = 10;
    createjs.Tween.get(this.sample, { loop: 8 })
      .to({ y: this.sample.y + bounceRange }, 200)
      .wait(100)
      .to({ y: this.sample.y - bounceRange }, 200)

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
    playable.Scene.apply(this, arguments);
  };

  SecondScene.prototype = Object.create(playable.Scene.prototype);
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

  playable.context.FirstScene = FirstScene;
  playable.context.SecondScene = SecondScene;
})();