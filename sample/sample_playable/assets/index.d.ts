/// <reference types="typescript" />

type ClassType<C> = new(...args) => C;

export type SceneType = ClassType<Scene>;

export class Preloader {
  getResult(id: string): any;
};

export interface SceneDelegate {
  sceneDelegateGetPreloader: (scene: Scene) => Perloader;
  sceneDelegateEmitEvent: (scene: Scene, event: any) => void;
  sceneDelegateSceneShouldEnd: (scene: Scene) => void;
  sceneDelegateStoryShouldEnd: (scene: Scene) => void;
}

export class Scene {
  delegate: SceneDelegate;
  stage: any;
  constructor(stage: any, config: any, delegate: any);
  get preloadManifest(): {id: string; src: string;}[];
  setup(props: Record<string, any>);
  tearDown();
  onEvent(event: any);
};

export class Story implements SceneDelegate {
  sendEvent: (event: any) => void;
};

export function playScenes(options: {scenes: SceneType[], canvasID?: string, completion?: () => void, onEvent?: (event: any) => void, background?: any, preloader?: Preloader}): Story;