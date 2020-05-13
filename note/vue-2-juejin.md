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

