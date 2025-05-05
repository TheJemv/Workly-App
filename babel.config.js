module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel', [
      'module-resolver', {
        root: ['./'],
        alias: {
          '@/assets': './assets',
          '@/auth': './auth',
          '@/components': './components',
          '@/config': './config',
          '@/constants': './constants',
          '@/context': './context',
          '@/functions': './functions',
          '@/models': './models',
          '@/screens': './screens',
          '@/services': './services',
          '@/stacks': './stacks',
          '@/test': './test',
          '@/utils': './utils',
          '@/lib': './lib',
          '@/data': './data'
        },
      }],
      ['module:react-native-dotenv',{
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false
      }],
      ["react-native-reanimated/plugin"],
    ],
  };
};
