try {
  if (module.exports !== undefined) {
    var playable = require('./playable');
  }
} catch (e) {}

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

  Scene.prototype.onEvent = function(event) {};

  playable.Scene = Scene;
})();
