# playables

This is a sample project for an HTML5 playable ad that can be used in tandem with [Google Web Designer](https://webdesigner.withgoogle.com/) (GWD) to create a custom ad that can be deployed to Google Ads.

## directories
### `sample/sample_playable`
This is the directory that GWD uses to manage the project.
Opening `sample/sample_playable/sample_playable.html` in GWD will open the sample project for editing, preview, and production building.
However, the main playable development should be done independent of GWD using the `sample/sample_playable/assets` directory.

### `sample/sample_playable/assets`
```
.
├── easeljs.js                # dev version of EaselJS, used for managing assets on the HTML Canvas
├── easeljs.min.js            # prod version of EaselJS
├── index.html                # development index.html which will be replaced by `../sample_playable.html` when running through GWD
├── index.js                  # development script which is replaced by an inline script in `../sample_playable.html` when running through GWD
├── main.min.js               # the minified output of `npm run minify` which is used as the playable script in GWD
├── package.json
├── playable.js               # initialization of the playable framework
├── playable_dimensions.js    # dimension file which can be used to isolate differences between the same playable with different dimensions
├── playable_play.js          # starts the story, loading scenes in the order they should be played
├── playable_scenes.js        # defines the base Scene class that can be extended to define scenes
├── playable_story.js         # manages the flow of the story when scenes change 
├── preloadjs.js              # dev version of PreloadJS, used for preparing assets for when they are needed in the story
├── preloadjs.min.js          # prod version of PreloadJS
├── sample.png                # A sample PNG file that is used in the scenes to demonstrate how to load and configure assets
├── sample_scenes.js          # defines the custom assets, animations, and interactions of each scene in the story
├── tweenjs.js                # dev version of TweenJS, used for animations
└── tweenjs.min.js            # prod version of TweenJS
```

## development
Go to the assets directory
- `cd sample/sample_playable/assets`

Install development dependencies
- `npm install`

Run the playable through a local server and open the page in a browser
- `npm start`

After starting the development server with `npm start`, you can edit the `playable_*.js` files and add more files to extend and modify the functionality in the sample.

## minify the playable for GWD
When running the playable from GWD, it uses `main.min.js` as the playable script rather than the source `playable_*.js` files.

To update the `main.min.js` from the current source, you can run:
- `npm run minify`