var playable = function() {
    let playable = {};
    playable.Position = {
        above: "above",
        below: "below",
        left: "left",
        right: "right",
        center: "center",
        centerX: "centerX",
        centerY: "centerY"
    };
    playable.context = {};
    Object.defineProperty(createjs.DisplayObject.prototype, "frame", {
        get: function() {
            let bounds = this.getBounds();
            return {
                x: this.x - this.regX,
                y: this.y - this.regY,
                width: bounds.width,
                height: bounds.height
            };
        }
    });
    Object.defineProperty(createjs.DisplayObject.prototype, "origin", {
        get: function() {
            return {
                x: this.x - this.regX,
                y: this.y - this.regY
            };
        },
        set: function(newValue) {
            this.x = newValue.x + this.regX;
            this.y = newValue.y + this.regY;
        }
    });
    createjs.DisplayObject.prototype.positionRelativeTo = function(other, direction, spacing) {
        let thisFrame = this.frame;
        let otherFrame = other.frame;
        if (spacing === undefined) {
            spacing = 0;
        }
        let newOrigin = {
            x: 0,
            y: 0
        };
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
            };
            break;

          case playable.Position.center:
            newOrigin = {
                x: otherFrame.x + otherFrame.width * .5 - thisFrame.width * .5,
                y: otherFrame.y + otherFrame.height * .5 - thisFrame.height * .5
            };
            break;

          case playable.Position.centerX:
            newOrigin = {
                x: otherFrame.x + otherFrame.width * .5 - thisFrame.width * .5 + spacing,
                y: thisFrame.y
            };
            break;

          case playable.Position.centerY:
            newOrigin = {
                x: thisFrame.x,
                y: otherFrame.y + otherFrame.height * .5 - thisFrame.height * .5 + spacing
            };
            break;
        }
        return newOrigin;
    };
    createjs.DisplayObject.prototype.setPositionRelativeTo = function(other, direction, spacing) {
        this.origin = this.positionRelativeTo(other, direction, spacing);
    };
    playable.Preloader = function() {
        this.loaded = {};
    };
    playable.Preloader.shared = null;
    playable.Preloader.prototype.loadImage = function(id, url) {
        return new Promise(resolve => {
            let image = new Image();
            let listener;
            listener = image.addEventListener("load", () => {
                image.removeEventListener("load", listener);
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
    playable.dimensions = ((scene, sceneName, event) => {
        let requirements = playable.SceneConfiguration[sceneName].require;
        let relocater = playable.SceneConfiguration[sceneName].relocate[event];
        requirements.forEach(r => {
            if (!Object.keys(scene).includes(r)) {
                throw new Error("Error: missing required asset " + r + " in " + sceneName + "." + event);
            }
        });
        return relocater.call(scene);
    });
    return playable;
}();

try {
    if (module.exports !== undefined) {
        module.exports = playable;
    }
} catch (e) {}

try {
    if (module.exports !== undefined) {
        var playable = require("./playable");
    }
} catch (e) {}

(function() {
    const p = playable;
    const canvasDimensions = {
        width: 320,
        height: 480
    };
    document.addEventListener("DOMContentLoaded", event => {
        const canvas = document.getElementById("playable-canvas");
        if (!canvas) {
            return;
        }
        canvas.setAttribute("width", canvasDimensions.width);
        canvas.setAttribute("height", canvasDimensions.height);
    });
    playable.SceneConfiguration = {
        shared: {},
        FirstScene: {
            require: [ "stage", "sample" ],
            relocate: {
                setup: function() {
                    this.stage.setBounds(0, 0, canvasDimensions.width, canvasDimensions.height);
                    this.sample.setPositionRelativeTo(this.stage, p.Position.centerX);
                    this.sample.setPositionRelativeTo(this.stage, p.Position.centerY);
                }
            }
        },
        SecondScene: {
            require: [ "stage" ],
            relocate: {
                setup: function() {}
            }
        }
    };
})();

try {
    if (module.exports !== undefined) {
        var playable = require("./playable");
    }
} catch (e) {}

(function() {
    playable.play = function(completion) {
        playable.Preloader.shared = new playable.Preloader();
        let stage = new createjs.Stage("playable-canvas");
        this.story = new playable.Story(stage, completion);
        let scenes = [ new playable.context.FirstScene(stage, playable.SceneConfiguration.shared, this.story), new playable.context.SecondScene(stage, playable.SceneConfiguration.shared, this.story) ];
        let background = undefined;
        this.story.tell(background, scenes);
    };
    playable.playScenes = function({scenes: scenes, canvasID: canvasID = "playable-canvas", completion: completion = null, background: background = undefined, preloader: preloader = undefined}) {
        let stage = new createjs.Stage(canvasID);
        let story = new playable.Story(stage, completion, preloader);
        let sceneInstances = scenes.map(sceneClass => new sceneClass(stage, playable.SceneConfiguration.shared, this.story));
        story.tell(background, sceneInstances);
        return story;
    };
})();

try {
    if (module.exports !== undefined) {
        var playable = require("./playable");
    }
} catch (e) {}

(function() {
    function Scene(stage, config, delegate) {
        this.stage = stage;
        this.config = config;
        this.delegate = delegate;
    }
    Object.defineProperty(Scene.prototype, "preloadManifest", {
        get() {
            return [];
        }
    });
    Scene.prototype.setup = function(props) {};
    Scene.prototype.tearDown = function() {
        return new Promise((resolve, reject) => resolve({}));
    };
    Scene.prototype.checkIntersection = function(rect1, rect2) {
        return !(rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x || rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y);
    };
    playable.Scene = Scene;
})();

try {
    if (module.exports !== undefined) {
        var playable = require("./playable");
    }
} catch (e) {}

(function() {
    function Story(stage, completion, preloader) {
        this.completion = completion;
        this.stage = stage;
        this.isWaitingForPreloadToAdvanceScene = false;
        this.preloader = preloader || playable.Preloader.shared;
    }
    Story.prototype.setBackground = function(image) {
        if (this.background) {
            this.stage.removeChild(this.background);
        }
        if (!image) {
            return;
        }
        this.background = new createjs.Bitmap(image);
        let hitArea = new createjs.Shape();
        hitArea.graphics.beginFill("#000").drawRect(0, 0, 320, 480);
        this.background.hitArea = hitArea;
        this.stage.addChildAt(this.background, 0);
    };
    Story.prototype.tell = function(background, scenes) {
        this.setBackground(background);
        this.stage.update();
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", this.stage);
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
        return this.preloader.loadManifest(manifest).then(() => {
            this.preloadedScenes.push(scene);
            return scene;
        });
    };
    Story.prototype.advanceSceneWhenReady = function() {
        let currentSceneIndex = this.currentScene !== null ? this.scenes.indexOf(this.currentScene) : null;
        let nextSceneIndex = currentSceneIndex !== null ? currentSceneIndex + 1 : 0;
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
    Story.prototype.sceneDelegateSceneShouldEnd = function(scene) {
        if (scene !== this.currentScene) {
            return;
        }
        this.advanceSceneWhenReady();
    };
    Story.prototype.sceneDelegateStoryShouldEnd = function(scene) {
        this.completion();
    };
    playable.Story = Story;
})();