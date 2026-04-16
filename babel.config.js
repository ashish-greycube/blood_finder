module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Only keep plugins you actually need, like Reanimated
      'react-native-reanimated/plugin', 
    ],
  };
};