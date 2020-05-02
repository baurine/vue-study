# Vue Misc

## Vue.use()

- [浅谈 Vue.use 与 Vue 组件开发](https://zhuanlan.zhihu.com/p/40192351)

Vue.use() 用来注册组件，内部实际使用了 Vue.component()。

Vue.component() 一次只能注册一个全局组件，但 Vue.use() 内部可以调用多次 Vue.component() 来注册多个全局组件，方便用户使用。

示例：

目录结构：

```
|-components
　　|-loading
　　　　|-index.js     导出组件，并且 install
　　　　|-loading.vue  定义 Loading 组件，这里面基本的 style, script 中之前讲的 methods, data 方法都可以使用
|-main.js
```

```js
// index.js
import LoadingComponent from './loading.vue'

const Loading = {
  install: function (Vue) {
    // 核心部分，在我们使用 Vue.use() 时，自动调用的是 install，而 install 导出的必须是的组件
    Vue.component('loading', LoadingComponent)
  },
}

export default Loading
```

在 main.js 中使用：

```js
// main.js
import Loading from './components/loading'
Vue.use(Loading) // 调用的是 install 里面的组件

...
<loading/>
```
