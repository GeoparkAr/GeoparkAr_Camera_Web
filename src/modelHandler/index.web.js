/**
 * loadModel for web.
 * Load model via static url. Copying model to static folder via copy-webpack-plugin
 * see webpack.config.js
 */
export const modelURI = `${window.location.origin}/model/model.json`;
