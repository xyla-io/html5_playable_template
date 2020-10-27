try {
  if (module.exports !== undefined) {
    var playable = require('./playable');
  }
} catch (e) {}

(function() {
  const p = playable;
  const FULL_DIMENSIONS = { width: 320, height: 480 };
  p.FULL_DIMENSIONS = FULL_DIMENSIONS;
  document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('playable-canvas');
    if (!canvas) { return; }
    canvas.setAttribute('width', FULL_DIMENSIONS.width);
    canvas.setAttribute('height', FULL_DIMENSIONS.height);
  })

  playable.SceneConfiguration = {
    shared: {},
    FirstScene: {
      require: ['stage', 'sample'],
      relocate: {
        setup: function() {
          this.stage.setBounds(0, 0, FULL_DIMENSIONS.width, FULL_DIMENSIONS.height);
          this.sample.setPositionRelativeTo(this.stage, p.Position.centerX);
          this.sample.setPositionRelativeTo(this.stage, p.Position.centerY);
          const bounceRange = 10;
          createjs.Tween.get(this.sample, { loop: 8 })
            .to({ y: this.sample.y + bounceRange }, 200)
            .wait(100)
            .to({ y: this.sample.y - bounceRange }, 200)
        },
      }
    },
    SecondScene: {
      require: ['stage'],
      relocate: {
        setup: function() {
        },
      },
    },
  };
})();
