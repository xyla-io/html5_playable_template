var playable = (function() {
  let playable = {};

  playable.Position = {
    above: 'above',
    below: 'below',
    left: 'left',
    right: 'right',
    center: 'center',
    centerX: 'centerX',
    centerY: 'centerY',
  };

  playable.context = {};

  playable.SceneConfiguration = {
    shared: {}
  };

  if (!('frame' in createjs.DisplayObject.prototype)) {
    Object.defineProperty(createjs.DisplayObject.prototype, 'frame', {
      get: function() {
        let bounds = this.getBounds();
        return {
          x: this.x - this.regX,
          y: this.y - this.regY,
          width: bounds.width,
          height: bounds.height
        }
      },
    });
  }

  if (!('origin' in createjs.DisplayObject.prototype)) {
    Object.defineProperty(createjs.DisplayObject.prototype, 'origin', {
      get: function() {
        return {
          x: this.x - this.regX,
          y: this.y - this.regY,
        }
      },
      set: function(newValue) {
        this.x = newValue.x + this.regX;
        this.y = newValue.y + this.regY;
      }
    });
  }

  createjs.DisplayObject.prototype.positionRelativeTo = function(other, direction, spacing) {
    let thisFrame = this.frame;
    let otherFrame = other.frame;
    if (spacing === undefined) {
      spacing = 0;
    }

    let newOrigin = { x: 0, y: 0 };
    switch (direction) {
      case playable.Position.above:
        newOrigin = {
          x: thisFrame.x,
          y: otherFrame.y - thisFrame.height - spacing
        };
        break;
      case playable.Position.below:
        newOrigin = {
          x: thisFrame.x,
          y: otherFrame.y + otherFrame.height + spacing
        };
        break;
      case playable.Position.left:
        newOrigin = {
          x: otherFrame.x - thisFrame.width - spacing,
          y: thisFrame.y
        };
        break;
      case playable.Position.right:
        newOrigin = {
          x: otherFrame.x + spacing,
          y: thisFrame.y
        }
        break;
      case playable.Position.center:
        newOrigin = {
          x: (otherFrame.x + otherFrame.width * 0.5) - (thisFrame.width * 0.5),
          y: (otherFrame.y + otherFrame.height * 0.5) - (thisFrame.height * 0.5)
        };
        break;
      case playable.Position.centerX:
        newOrigin = {
          x: (otherFrame.x + otherFrame.width * 0.5) - (thisFrame.width * 0.5) + spacing,
          y: thisFrame.y
        };
        break;
      case playable.Position.centerY:
        newOrigin = {
          x: thisFrame.x,
          y: (otherFrame.y + otherFrame.height * 0.5) - (thisFrame.height * 0.5) + spacing
        }
        break;
    }
    return newOrigin
  }

  createjs.DisplayObject.prototype.setPositionRelativeTo = function(other, direction, spacing) {
    this.origin = this.positionRelativeTo(other, direction, spacing);
  }

  playable.Preloader = function() {
    this.loaded = {};
  };
  playable.Preloader.shared = null;

  playable.Preloader.prototype.loadImage = function(id, url) {
    return new Promise(resolve => {
      let image = new Image();
      let listener;
      listener = image.addEventListener('load', () => {
        image.removeEventListener('load', listener);
        this.loaded[id] = image;
        resolve(image);
      });
      image.src = url;
    });
  };

  playable.Preloader.prototype.loadManifest = function(manifest) {
    let promises = manifest.map(item => this.loadImage(item.id, item.src));
    return Promise.all(promises);
  };

  playable.Preloader.prototype.getResult = function(id) {
    return this.loaded[id];
  };

  playable.dimensions = (scene, sceneName, event) => {
    let requirements = playable.SceneConfiguration[sceneName].require;
    let relocater = playable.SceneConfiguration[sceneName].relocate[event];

    requirements.forEach(r => { 
      if (!Object.keys(scene).includes(r)) {
        throw new Error('Error: missing required asset ' + r + ' in ' + sceneName + '.' + event);
      }
    }); 
    return relocater.call(scene);
  }

  return playable;
})();

try {
  if (module.exports !== undefined) {
    module.exports = playable;
  }
} catch (e) {}
