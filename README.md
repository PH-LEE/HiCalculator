# Hi! Calculator

你好！這是個簡易的網頁計算機，從零開始搭建的一個 React app  
文檔記錄了搭建方法及開發所遇到的問題和解答

## Tech Stacks

`React`, `styled-components`, `TypeScript`, `Babel`, `webpack`,  
`Jest + testing-library/react + testing-library/jest-dom + testing-library/user-event`

## 環境搭建

### React:

因有使用 `typescript` , 需加入 `react` & `react-dom` 型別

```
npm install react react-dom @types/react @types/react-dom
```

### styled-components:

`styled-components` 核心為 ES6 的 `Tagged Template Literals` 讓 style 添加到 React Element 上，無需透過 babel 或 webpack 編譯和打包（不支援 `Tagged Template Literals` 的瀏覽器當然還是須透過 babel 編譯)

```
npm install --save styled-components
```

安裝 [`babel-plugin-styled-components`] (https://styled-components.com/docs/tooling#babel-plugin)可讓 styles 檔案大小優化且方便除錯

```
npm install --save-dev babel-plugin-styled-components
```

加入 styled-components `typescript` 的型別

```
npm install --save-dev @types/styled-components
```

#### config:

```json
//set in babel.config.js or webpack babel-loader
"plugins" : [
   [
      "babel-plugin-styled-components",
      {
        "minify": true, //for prod 將 style壓縮
        "displayName": true, //for dev 顯示component name於className內方便除錯
        "pure": true, //for prod 將style標註為pure 方便tree shake
      },
   ]
]
```

### webpack:

專案開發時使用 `webpack-dev-server` 當 app 的服務器，需加入此套件

```
npm install -save-dev webpack webpack-cli webpack-dev-server
```

安裝 `babel-loader` 讓 `webpack` 可透過安裝好的 `babel preset` 或 `babel plugings` 將程式碼編譯成目標的 js 語法

```
npm install --save-dev babel-loader
```

#### config:

將 config 檔案拆分成 `common` , `dev` and `prod`

```javascript
// webpack.common.js
const path = require('path')
// 此套件可將 bundle 檔輕鬆插入 html template中
const HtmlWebpackPlugin = require('html-webpack-plugin')
// webpackEnv 可透過 cli 設定 ex: webpack serve --env development
module.exports = function (webpackEnv) {
  const isEnvDev = !!webpackEnv.development
  const isEnvPrd = !!webpackEnv.production

  return {
    entry: '/src/index.tsx',
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: '/public/index.html',
      }),
    ],
    output: {
      // dev 時不會有output, 直接存在內存中讓webpack server使用
      path: isEnvPrd ? path.resolve(__dirname, 'build') : undefined,
      filename: isEnvPrd
        ? 'static/js/[name].[contenthash:8].js' //[contenthash] 將程式內容進行編碼成為檔名，因此內容改變hash也會改變，可用在cache功能
        : isEnvDev && 'static/js/[name].bundle.js',
      publicPath: '/',
      clean: true, // 每次打包都將過去bundle資料清除
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              // 在此設定babel所用到的presets and plugins，打包時優先級大於babel.config.js
              presets: [
                /*
                runtime automatic 會自動 import 新的 JSX 編譯器，
                因此不需要再多寫import React from 'react' 使用到react hook 還是需要引入
                ref: https://zh-hant.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-different-in-the-new-transform
                */
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
              plugins: [
                [
                  'babel-plugin-styled-components',
                  {
                    minify: isEnvPrd,
                    displayName: isEnvDev,
                    pure: isEnvPrd,
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '...'],
    },
    optimization: {
      // 程式內容改變時，引入的模塊不會自動更改id++，使cache正常
      moduleIds: 'deterministic',
      // 將runtime分離打包為一個檔案，改善因webpack內部
      // 生成runtime和manifest造成每次打包內容沒改變但bundle卻是新的問題
      runtimeChunk: 'single',
      splitChunks: {
        // 遵循webpack預設規則將檔案拆分，加快app下載速度
        chunks: 'all',
        // 將不太會變動的模塊cache住加快app下載速度 ex: React,...
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  }
}
```

```javascript
// webpack.dev.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (webpackEnv) {
  return merge(common(webpackEnv), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './build',
      hot: true, // 開啟熱交換方便開發
    },
  })
}

// webpack.prod.js
module.exports = function (webpackEnv) {
  return merge(common(webpackEnv), {
    mode: 'production',
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: '/public/index.html',
      }),
    ],
  })
}
```

### Babel:

安裝 `preset-env` , `preset-react` , `preset-typescript` 的目的是將 es6 之後的語法, jsx 及 typescript 語法編譯成目標的 javascript

```
npm install --save-dev @babel/core @babel/preset-react @babel/preset-env @babel/preset-typescript
```

#### config:

```javascript
// in webpack babel-loader.options for webpack transpile
presets: [
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
],
plugins: [
  [
    'babel-plugin-styled-components',
    {
      minify: isEnvPrd,
      displayName: isEnvDev,
      pure: isEnvPrd,
    },
  ],
],

// in babel.config.js for transpiling jest content
module.exports = (api) => {
  const isTest = api.env('test')
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {node: 'current'}, //transform ES6+ to node.js
          modules: isTest ? 'auto' : false,
          // when prod we dont want babel transfrom ES module
          // to other module which will make tree shake fail
        },
      ],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
  }
}

```

### typescript:

```
npm install typescript
```

#### config:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es6" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,

    "jsx": "react-jsx" /* Specify what JSX code is generated. */,

    "module": "esnext" /* Specify what module code is generated. */,

    "moduleResolution": "node" /* Specify how TypeScript looks up a file from a given module specifier. */,

    "baseUrl": "./" /* Specify the base directory to resolve non-relative module names. */,

    "allowJs": true /* Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files. */,

    "noEmit": true /* Disable emitting files from a compilation. */,

    "isolatedModules": true /* Ensure that each file can be safely transpiled without relying on other imports. */,

    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,

    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    "strict": true /* Enable all strict type-checking options. */,

    "noImplicitAny": true /* Enable error reporting for expressions and declarations with an implied `any` type.. */,

    "strictNullChecks": true /* When type checking, take into account `null` and `undefined`. */,

    "noUnusedLocals": true /* Enable error reporting when a local variables aren't read. */,

    "noUnusedParameters": true /* Raise an error when a function parameter isn't read */,

    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  },
  "exclude": ["node_modules"],
  "include": ["src/*.ts", "src/*.tsx"]
}
```

### jest:

安裝 `babel-jest` 將 `jest` 語法轉譯成目標的 js 才能執行

```
npm install --save-dev jest babel-jest
```

安裝 `testing-library/jest-dom` , `testing-library/react` 和 `testing-library/user-event` 使 dom testing 更加方便  
dom-testing 主要是針對使用者操作後所得到的結果進行測試，不去關注 implementation 細節的原因是實作方法會迭代，迭代後需修改測試項目進而增加額外的成本  
還需安裝 `jest-environment-jsdom` 讓測試環境變為 web 環境才能操作 dom

```
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

#### config:

```javascript
//jest.config.js or package.json.jest
module.exports = {
  moduleFileExtensions: ['tsx', 'ts', 'js', 'jsx'],
  moduleDirectories: ['node_modules', 'shared'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom', // must change to jsdom
  setupFilesAfterEnv: [
    '<rootDir>/jest-setup.js', // read jest-setup for jest-dom library
  ],
}

//jest-setup.js
import '@testing-library/jest-dom'
```

### 計算機所運用的演算法:

使用逆波蘭演算法(reverse polish notation)，將計算機顯示器所呈現的 `字串數值` 和 `運算符號` 推入 `stack` 加以計算並得出實際數值
