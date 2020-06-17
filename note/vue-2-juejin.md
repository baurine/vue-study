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

vue-cli 3.x 封装的 webpack 配置自动完成了这个功能，但它仅会将 env 文件中定义的 VUE*APP* 打头的变量，以及 NODE_ENV 注入到前端代码中，其余变量会过滤掉。

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

## 7. 构建实战篇 3：多页路由与模板解析

### 路由配置

#### 1. 跳转

多页应用中每个单页都是相互隔离的，所以跳转时不能再 router 提供的方法或组件进行跳转，而需要使用传统的 `<a>` tag 和 `location.href` 等方法。

#### 2. 重定向

光用上面的方法还不够 (试试 `location.reload()` 呢?)。

还要对每个单页的路由首页进行重定向，比如：

```
/vue/page1 -> /vue/page1.html
/vue/page2 -> /vue/page2.html
```

生产环境可以使用 nginx 或借助后端逻辑，开发时可以配置代理或 rewrite。

```js
/* vue.config.js */

let baseUrl = '/vue/';

module.exports = {
    ...
    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: new RegExp(baseUrl + 'page1'), to: baseUrl + 'page1.html' },
                { from: new RegExp(baseUrl + 'page2'), to: baseUrl + 'page2.html' },
            ]
        }
    }
    ...
}
```

### 模板配置

#### 1. 模板渲染

html-webpack-plugin 所使用的 html 模板支持模板语法，比如：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>模板</title>
    <% for (var chunk in htmlWebpackPlugin.files.css) { %> <%
    if(htmlWebpackPlugin.files.css[chunk]) {%>
    <link href="<%= htmlWebpackPlugin.files.css[chunk] %>" rel="stylesheet" />
    <%}%> <% } %>
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->

    <% for (var chunk in htmlWebpackPlugin.files.js) { %> <%
    if(htmlWebpackPlugin.files.js[chunk]) {%>
    <script
      type="text/javascript"
      src="<%= htmlWebpackPlugin.files.js[chunk] %>"
    ></script>
    <%}%> <% } %>
  </body>
</html>
```

默认情况下 css / js 是自动注入的，并不需要我们手动注入。将 html-webpack-plugin 的参数中的 inject 设置为 false 可以关闭自动注入。

(了解即可...)

#### 2. 自定义配置

上面的例子是为了铺垫一些其它需求，比如需要给不同的页面注入不同的逻辑，比如不同的页面需要注入不同的统计代码，就可以上面的模板语法。

示例：

```js
/* vue.config.js */
module.exports = {
    ...
    pages: utils.setPages({
        addScript() {
            if (process.env.NODE_ENV === 'production') {
                return `
                    <script src="https://s95.cnzz.com/z_stat.php?id=xxx&web_id=xxx" language="JavaScript"></script>
                `
            }
            return ''
        }
    }),
    ...
}
```

在 html 模板：

```
<% if(htmlWebpackPlugin.options.addScript){ %>
    <%= htmlWebpackPlugin.options.addScript() %>
<%}%>
```

可以给 `addScript()` 方法加上参数来区别不同的页面，从而实现不同的页面可以添加不同的脚本逻辑。

## 8. 构建实战篇 4：项目整合与优化

### 使用 alias 简化路径

(这个蛮实用的)

可以将类似 `import HelloWorld from '../../../../HelloWorld.vue'` 简化写成 `import HelloWorld from '_com/HelloWorld.vue'`。

在 vue.config.js 中的配置：

```js
/* vue.config.js */
module.exports = {
    ...
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_lib', resolve('src/common'))
            .set('_com', resolve('src/components'))
            .set('_img', resolve('src/images'))
            .set('_ser', resolve('src/services'))
    },
    ...
}
```

在 css 中使用简写路径时，前面要加上 `~` 号，比如：

```css
.img {
  background: (~_img/home.png);
}
```

### 整合功能模块

就是抽取相同方法到公共模块中...

### 开启 Gzip 压缩

略... (一般都不在前端干这事)

(这小册写得有点乱，有点想弃了)

## 9. 开发指南篇 1：从编码技巧与规范开始

1. 使用对象代替 if 及 switch：算是小技巧吧，也不是很实用
1. 使用 Array.from 快速生成数组
1. 使用 router.beforeEach 来处理跳转前逻辑：修改路由跳转、设置 title、判断权限、启动进度...
1. 使用 v-if 来优化页面加载
1. 路由跳转尽量使用 name 而不是 path (有道理)
1. 使用 key 来优化 v-for 循环
1. 使用 computed 代替 watch
1. 统一管理缓存变量
1. 使用 setTimeout 代替 setInterval
1. 不要使用 for in 循环来遍历数组

## 10. 开发指南篇 2：学会编写可复用性模块

1. 封装函数
1. 封装组件
1. 封装插件

(这个小册可能对小白价值大一点...)

## 11. 开发指南篇 3：合理划分容器组件与展示组件

略。

## 12. 开发指南篇 4：数据驱动与拼图游戏

略。

## 13. 开发指南篇 5：Vue API 盲点解析

### 使用 performance 开启性能追踪

```js
if (process.env.NODE_ENV !== 'production') {
  Vue.config.performance = true
}
```

### 使用 errorHandler 来捕获异常

vue 的全局 error handler.

```js
Vue.config.errorHandler = function (err, vm, info) {
  let {
    message, // 异常信息
    name, // 异常名称
    stack, // 异常堆栈信息
  } = err
  // vm 为抛出异常的 Vue 实例
  // info 为 Vue 特定的错误信息，比如错误所在的生命周期钩子
}
```

### 使用 nextTick 将回调延迟到下次 DOM 更新循环之后执行

```js
this.$nextTick(() => {
  this.$refs.box.getElementsByTagName('li')[0].innerHTML = 'hello'
})
```

### 使用 watch 的深度遍历和立即调用功能

watch 的额外两个参数：

- deep 设置为 true 用于监听对象内部值的变化
- immediate 设置为 true 将立即以表达式的当前值触发回调

### 对低开销的静态组件使用 v-once

```
<my-component v-once :data="msg"></my-component>
```

无论 msg 怎么变，只渲染 msg 第一次变化时的值。

### 使用 `$isServer` 判断当前实例是否运行于服务器

```js
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering,
})

var _isServer
var isServerRendering = function () {
  if (_isServer === undefined) {
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      _isServer = global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }
  return _isServer
}
```
