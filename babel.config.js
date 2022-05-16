module.exports = (api) => {
  const isTest = api.env('test')
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {node: 'current'}, //for jest 
          modules: isTest ? 'auto' : false,
        },
      ],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
  }
}
