# 掘金小册《Vue 项目构建与开发入门》笔记

(这个小册个人觉得写得一般)

## 1. 开篇：Vue CLI 3 项目构建基础

node 安装，略。(更推荐用 nvm)

脚手架 vue-cli

```
yarn global add @vue/cli
vue create my-project
```

启动

```
cd my-project
yarn serve
```

vue-cli 提供了 UI 界面：`vue ui`。

## 2. 构建基础篇 1：你需要了解的包管理工具与配置项

... 没啥有价值内容

## 3. 构建基础篇 2：webpack 在 CLI 3 中的应用

在 vue.config.js 中进行 webpack 的配置。

```js
// vue.config.js
module.exports = {
    ...
    publicPath: 'vue', // 修改 webpack 中的 output 下的 publicPath
    outputDir: 'output', // 修改 webpack 中的 output 下的 path 项
    productionSourceMap: true, // 修改 webpack 中 devtool 项的值为 source-map
    ...
}
```

### chainWebpack

chainWebpack 配置项允许我们更细粒度的控制 webpack 的内部配置，其集成的是 webpack-chain 这一插件，该插件可以让我们能够使用链式操作来修改配置。

```js
// 用于做相应的合并处理
const merge = require('webpack-merge');

module.exports = {
    ...
    // config 参数为已经解析好的 webpack 配置
    chainWebpack: config => {
        config.module
            .rule('images')
            .use('url-loader')
            .tap(options =>
                merge(options, {
                  limit: 5120,
                })
            )
    }
    ...
}
```

### configureWebpack

chainWebpack 是链式修改，而 configureWebpack 更倾向于整体替换和修改。

```js
// vue.config.js
module.exports = {
    ...
    // config 参数为已经解析好的 webpack 配置
    configureWebpack: config => {
        // config.plugins = []; // 这样会直接将 plugins 置空

        // 使用 return 一个对象会通过 webpack-merge 进行合并，plugins 不会置空
        return {
            plugins: []
        }
    }
    ...
}
```

在项目目录下执行 `vue inspect` 查看修改后的 webpack 配置，也可以查看一部分内容，比如 `vue inspect plugins`。

### devServer

配置 webpack-dev-server 的行为。

```js
// vue.config.js
module.exports = {
    ...
    devServer: {
        open: true, // 是否自动打开浏览器页面
        host: '0.0.0.0', // 指定使用一个 host。默认是 localhost
        port: 8080, // 端口地址
        https: false, // 使用https提供服务
        proxy: null, // string | Object 代理设置

        // 提供在服务器内部的其他中间件之前执行自定义中间件的能力
        before: app => {
          // `app` 是一个 express 实例
        }
    }
    ...
}
```

感觉 vue-cli 这个修改 webpack 的设计机制比 CRA 好一些。

## 4. 构建基础篇 3：env 文件与环境设置

### 1. 配置文件

可以在根目录下创建不同形式的文件进行不同环境下变量的配置：

```
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```

比如创建 `.env.stage` 文件，表明该文件只在 stage 环境下被加载：

```
NODE_ENV=stage
VUE_APP_TITLE=this app is in stage mode
```

如何在 vue.config.js 访问到这些变量，通过 `process.env.[name]`，比如 `process.env.NODE_ENV`。

如何在启动时决定加载哪个环境的变量，使用 `--mode` 参数：

```
"scripts": {
    "serve": "vue-cli-service serve --mode stage",
}
```

权重：

```
.env.[mode].local > .env.[mode] > .env.local > .env
```

注意：这些 env 文件中的环境变量在 vue.config.js 有效，并不一定在前端代码中生效。

### 2. 环境注入

上面用 env 文件定义的环境变量并不一定在前端代码中生效。

webpack 通过 DefinePlugin 内置插件将 process.env 注入到前端代码中。

```
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
    ],
```

vue-cli 3.x 封装的 webpack 配置自动完成了这个功能，但它仅会将 env 文件中定义的 VUE_APP_ 打头的变量，以及 NODE_ENV 注入到前端代码中，其余变量会过滤掉。

### 3. 额外配置

在 vue.config.js 中通过代码动态定义，然后通过 DefinePlugin 手动动态注入。

```
/* vue.config.js */
const configs = require('./config');

// 用于做相应的 merge 处理
const merge = require('webpack-merge');

// 根据环境判断使用哪份配置
const cfg = process.env.NODE_ENV === 'production' ? configs.build.env : configs.dev.env;

module.exports = {
    ...

    chainWebpack: config => {
        config.plugin('define')
            .tap(args => {
                let name = 'process.env';

                // 使用 merge 保证原始值不变
                args[0][name] = merge(args[0][name], cfg);

                return args
            })
    },

    ...
}
```

### 4. 实际场景

略。

## 5. 构建实战篇 1：单页应用的基本配置

### 1. 路由配置

vue-router 采用配置式路由，可以使用 import 来动态引用组件来实现拆分代码，代码拆分默认命名为 2.js, 3.js 这种，如果想给它们命名，可以使用 webpack 提供的 magic comments:

```
const Home = () => import(/* webpackChunkName:'home'*/ './views/Home.vue');
```

### 2. Vuex 配置

4 个核心点：state, mutations, actions, getters。

按模块划分，每个模块下都有 state, mutations, actions, getters。

### 3. 接口配置

services 目录，封装 api 请求。

在 vue.config.js 中配置 proxy 代理用于开发调式。

### 4. 公共设施配置

common 或 utils 目录，封装公共方法。

## 6. 构建实战篇 2：使用 pages 构建多页应用

多页应用，多个 pages，每个 page 有独立的入口文件、组件、路由、vuex 等。

目录结构：

```
├── node_modules               # 项目依赖包目录
├── build                      # 项目 webpack 功能目录
├── config                     # 项目配置项文件夹
├── src                        # 前端资源目录
│   ├── images                 # 图片目录
│   ├── components             # 公共组件目录
│   ├── pages                  # 页面目录
│   │   ├── page1              # page1 目录
│   │   │   ├── components     # page1 组件目录
│   │   │   ├── router         # page1 路由目录
│   │   │   ├── views          # page1 页面目录
│   │   │   ├── page1.html     # page1 html 模板
│   │   │   ├── page1.vue      # page1 vue 配置文件
│   │   │   └── page1.js       # page1 入口文件
│   │   ├── page2              # page2 目录
│   │   └── index              # index 目录
│   ├── common                 # 公共方法目录
│   └── store                  # 状态管理 store 目录
├── .gitignore                 # git 忽略文件
├── .env                       # 全局环境配置文件
├── .env.dev                   # 开发环境配置文件
├── .postcssrc.js              # postcss 配置文件
├── babel.config.js            # babel 配置文件
├── package.json               # 包管理文件
├── vue.config.js              # CLI 配置文件
└── yarn.lock                  # yarn 依赖信息文件
```

多入口。在单页应用中，入口文件只有一个，cli 默认配置是 main.js (?? 不是 index.js)，多页应用则要在 webpack 的 entry 中配置多个入口：

```js
module.exports = {
    ...
    entry: {
        page1: '/xxx/pages/page1/page1.js',
        page2: '/xxx/pages/page2/page2.js',
        index: '/xxx/pages/index/index.js',
    },
    ...
}
```

可以借助 glob 库，封装一个工具方法来动态生成 entry。详略。

多模板，添加多个 `new HtmlWebpackPlugin({...})`，同样可以用 glob 库封装工具函数来动态生成多个 `HtmlWebpackPlugin({...})`。详略。

但实际 vue.config.js 提供了一个 pages 的配置属性来声明多页面，效果和上面手工方法是一样的，但也要自己写一些工具方法封装。详略。
