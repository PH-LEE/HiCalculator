# Hi! Calculator

你好！這是個簡易的網頁計算機，從零開始搭建的一個 React app
文檔記錄了搭建方法及開發所遇到的問題和解答

## Tech Stacks

`React`, `styled-components`, `TypeScript`, `Babel`, `webpack`,
`Jest + testing-library/react + testing-library/jest-dom + testing-library/user-event`

## 環境搭建

### React:

因有使用 `typescript`, 需加入 `react` & `react-dom` 型別

```
npm install react react-dom @types/react @types/react-dom
```

### styled-components:

`styled-components` 核心為 ES6 的 `Tagged Template Literals`讓 style 添加到 React Element 上，無需透過 babel 或 webpack 編譯和打包（不支援 `Tagged Template Literals` 當然還是須透過 babel 編譯)

```
npm install --save styled-components
```

安裝 [`babel-plugin-styled-components`](https://styled-components.com/docs/tooling#babel-plugin)可讓 styles 檔案大小優化且方便除錯

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

專案開發時使用 `webpack-dev-server`當 app 的服務器，需加入此套件

```
npm install -save-dev webpack webpack-cli webpack-dev-server
```

安裝`babel-loader`讓 `webpack` 可透過安裝好的 `babel preset` 或 `babel plugings` 將程式碼編譯成目標的 js 語法

```
npm install --save-dev babel-loader
```

#### config:

將 config 檔案拆分成 `common`, `dev` and `prod`

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

安裝`preset-env`, `preset-react`, `preset-typescript`的目的是將 es6 之後的語法, jsx 及 typescript 語法編譯成目標的 javascript

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
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Enable incremental compilation */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./",                          /* Specify the folder for .tsbuildinfo incremental compilation files. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es6" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    "jsx": "react-jsx" /* Specify what JSX code is generated. */,
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h' */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.` */
    // "reactNamespace": "",                             /* Specify the object invoked for `createElement`. This only applies when targeting `react` JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */

    /* Modules */
    "module": "esnext" /* Specify what module code is generated. */,
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    "moduleResolution": "node" /* Specify how TypeScript looks up a file from a given module specifier. */,
    "baseUrl": "./" /* Specify the base directory to resolve non-relative module names. */,
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like `./node_modules/@types`. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "resolveJsonModule": true,                        /* Enable importing .json files */
    // "noResolve": true,                                /* Disallow `import`s, `require`s or `<reference>`s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    "allowJs": true /* Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files. */,
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from `node_modules`. Only applicable with `allowJs`. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output. */
    // "outDir": "./",                                   /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    "noEmit": true /* Disable emitting files from a compilation. */,
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have `@internal` in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like `__extends` in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing `const enum` declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    "isolatedModules": true /* Ensure that each file can be safely transpiled without relying on other imports. */,
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    "noImplicitAny": true /* Enable error reporting for expressions and declarations with an implied `any` type.. */,
    "strictNullChecks": true /* When type checking, take into account `null` and `undefined`. */,
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for `bind`, `call`, and `apply` methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when `this` is given the type `any`. */
    // "useUnknownInCatchVariables": true,               /* Type catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    "noUnusedLocals": true /* Enable error reporting when a local variables aren't read. */,
    "noUnusedParameters": true /* Raise an error when a function parameter isn't read */,
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Include 'undefined' in index signature results */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  },
  "exclude": ["node_modules"],
  "include": ["src/*.ts", "src/*.tsx"]
}
```

### jest:

安裝 `babel-jest` 將 jest 語法轉譯成目標的 js 才能執行

```
npm install --save-dev jest babel-jest
```

安裝 `testing-library/jest-dom`, `testing-library/react` 和 `testing-library/user-event` 使 dom testing 更加方便
dom-testing 主要是針對使用者操作後所得到的結果進行測試，不去關注 implementation 細節的原因是實作方法會迭代，迭代後需修改測試項目反而成為額外的成本
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

使用逆波蘭演算法(reverse polish notation)
將計算機顯示器所呈現的 `字串數值` 和 `運算符號`
推入 `stack` 加以計算並得出實際數值
