/// <reference types="typescript" />

export class Scene {
  constructor(stage: any, config: any, delegate: any);
};

export class Story {};

export function playScenes(options: {scenes: any[], canvasID?: string, completion: () => void, background?: any, preloader?: any}): Story;