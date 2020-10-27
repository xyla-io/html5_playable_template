try {
  if (module.exports !== undefined) {
    var playable = require('./playable');
  }
} catch (e) {}

(function() {
  const p = playable;
  const canvasDimensions = { width: 320, height: 480 };
  document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('playable-canvas');
    if (!canvas) { return; }
    canvas.setAttribute('width', canvasDimensions.width);
    canvas.setAttribute('height', canvasDimensions.height);
  })

  playable.SceneConfiguration = {
    shared: {},
    FirstScene: {
      require: ['stage', 'sample'],
      relocate: {
        setup: function() {
          this.stage.setBounds(0, 0, canvasDimensions.width, canvasDimensions.height);
          this.sample.setPositionRelativeTo(this.stage, p.Position.centerX);
          this.sample.setPositionRelativeTo(this.stage, p.Position.centerY);
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
