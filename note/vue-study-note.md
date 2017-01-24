# Vue Study Note

## Reference

1. [Laracasts Video Tutorial - Learning Vue Step by Step](https://laracasts.com/series/learning-vue-step-by-step)
1. [Official Document](http://vuejs.org.cn/guide/)

## Note Part 1

This part note is record for [Laracasts Video Tutorial - Learning Vue Step by Step](https://laracasts.com/series/learning-vue-step-by-step).

### 1 - Databinding

Vue bind the element and data：

    Vue({
      el: ..., 
      data: ...
    })

v-model：

    <body>
      <div id="app">
        <h1>{{ message }}</h1>
        <input v-model='message'>   // v-model
        <pre>{{ $data | json }}</pre>
      </div>

      <script src="http://cdnjs.cloudflare.com/ajax/libs/vue/1.0.26/vue.min.js"></script>

      <script>
        // 这里，vue 的作用就是将 view ('#app') 和 model (data) 进行绑定
        new Vue({
          el: '#app',
          data: {
            message: 'HelloWorld'
          }
        })
      </script>
    </body>

### 2 - Vue Show

`v-show` 与 `v-if`：`v-show`，如果条件为假，只会把 dom 隐藏 (diplay: none)，而不会把它 remove 掉，而 `v-if` 的条件为假的话，是会把 dom 彻底的移除。就跟 android 中的 View.NONE 和 View.INVISIBlE 一样。

    <div id="app">
      <form>
        <span class="error" v-show='!message'>Send your message</span>
        <textarea v-model='message'></textarea>
        <button type="submit" v-if='message'>Send message</button>
        <pre>{{ $data | json }}</pre>
      </form>
    </div>

### 3 - Event Handling

    v-on:submit="handleSubmit"  
    -->
    v-on:submit.prevent="handleSubmit"
    -->
    @submit.prevent="handleSubmit"

同时要在 Vue 中定义对应的  methods 成员：

    new Vue({
      methods: {
        handleSubmit: function() {
          ...
        }
      }
    }

定义在 form 中的 type 为 submit 的 button，点击后默义会向上层发送 submit 事件，但是如果在它自己的 click 事件中执行 `e.preventDefault()` 后，就不会再向上层发送 submit 事件。如下所示：

    // 使用 @click.prevent 后，将只会执行 handleClick 方法，不会执行 handleSubmit 方法，但是如果只使用 @click 的话，两者都会执行。
    <form action='done.html' @submit.prevent="handleSubmit">
      <button type="submit" @click.prevent="handleClick">Click Me!</button>
    </form>

counter 示例：

    <div id="app">
      <button type="submit" @click="count += 1">
        click times: {{ count }}
      </button>
    </div>

### 4 - A Peek into Components

`Vue.component()` 注册全局 component，也可以直接在 Vue 实例中注册局部 Component，如下：

    new Vue({
      el: '#app',

      components: {
        counter: {
          ...
        }
      }
    }

### 5 - Computed Properties

使用 computed 和 watch 功能，达到相同效果。让我想起了 swift，watch 相当于 stored property 的 willSet 和 didSet，computed 就相当于 swfit 中的 computed property。

### 6 - Subscription Plans Exercise

一个简单的完整例子，订阅计划。演示了 `v-for`, `v-show` / `v-else`， `.sync` 用法。

1. 在使用 props 向子 compoent 传递参数时，加上 ":"，否则传递的就不是变量，而是单纯的字符串。

        <AComponent :plan="plan">  // 传递的 plan props 是 data 里的 plan 变量
        <AComponent plan="plan">   // 传递的 plan props 只是单纯的 "plan" 字符串

2. `.sync`，双向绑定，子组件要改变父组件传递过来的 props 时，加上 `.sync`，实现双向绑定。如果不加 `.sync`，改变的只是子组件内部的变量，加上 `.sync`，就会同时改变父组件同名的变量。

3. `v-else`

4. dev tool，很强大的样子，react 也有。

5. inline-template

### 7 - Rendering and Working with Lists

演示 class 的绑定语法：

    :class = "{ 'completed': task.completed }"

### 8 - Custom Component

演示传递一个 model 作为 prop 时的绑定：

    :propName = "tasks"; 

如果没有 ":"，那么传递的只是一个字符串，如果加上 ":"，则传递的是 tasks 变量。

### 9 - Todo sample

没有新内容，继续演示 computed property。

### 10 - Vue, Laravel, Ajax

演示从服务器得到数据，用 PHP 实现的服务器，我改成用 node 吧。

`@{{ task.body }}` 前面加个 @ 是什么作用 ?? --> 新版本 vue 不需要这个 @ 了。

`created()`：生命周期函数。

### 11 - Vue Resource

如果只是为了使用 ajax 而引入 jquery，有点太重了，所以我们可以用 vue-resource 来替代 jquery。vue-resource 里包含 http 请求库。

vue-resource 同时支持 promise，<https://github.com/vuejs/vue-resource>。

### 12 - Component Exercise

`<slot>`，相当于 react 中的 `{ children }`。

先把视频看完，练习先不做了。

看完视频再把文档看一下。

13 集是收费的，略过。

### 14 - Vue Filter Essentials

1. 强大的 filter 及其使用
1. 自定义 filter

        <h1> {{ "hello" | uppercase }} </h1>

自定义：

    Vue.filter('jsonIt', function(value) {} )

这里的 filter 和 linux shell 中的管道的作用很相似。

### 15 - Managing Custom Events

子组件修改 model 后，如何通知上层。我看 vue 这里使用了和 iOS 一样的方案，使用广播方式。底层 dispatch 一个 event，上层接收后处理。

1. `@keyup.enter = "storeMessage"`

2. 底层通过 dispatch 发送广播

        this.$dispatch('new-message', this.message)

3. 上层处理 event

        new Vue({
          events: {
            'new-message': function(message) {
              ...
            }
          }
        }

4. 上层的另一种处理方式

        <input v-on:new-message="handelNewMessage">
        //or
        <input @new-message="handleNewMessage">

        new Vue({
          methods: {
            handleNewMessage: function(messge) {
              ...
            }
          }
        }

16 集收费

### 17 - Vue Transitions and Animations

css 动画：

1. 为 dom 加上 transition 属性，如：

        <div v-show="show" transition="fade">hello world</div>

2. 定义 transition 属性后，vue 会转换成 `class="fade-transition"` 的 class，因为要在 css 中手动定义 `.fade-transition`, `.fade-enter`, `.fade-leave` 等 css 属性。(和传统方式一样)

        .fade-transition {
            transition: all .5s ease;
        }

        .fade-enter, .fade-leave {
            opacity: 0;
        }

3. 除了手动方式，也可以使用 `Vue.transition('fade', enterClass: ..., leaveClass: ...)` 定义全局 transition，这样，就不用再手动设置 `.fade-transition`, `.fade-enter`, `.fade-leave` 等 css。

4. 使用第三方动画库 Animated.css 来代替自己定义 enterClass, leaveClass。

        <div v-show="show" transition="fade" class="animated"> 
          hello world
        </div>

        // fadeIn 和 fadeOut 来自 Animated.css 中定义的 class
        Vue.transition("fade", enterClass: "fadeIn", leaveClass: "fadeOut")

### 21 - Alert Component from Scratch

将一个 component 相关的所有内容写在一个 .vue 文件中。

    // Alert.vue
    <template>
    </template>

    <script>
    </script>

    <style>
    </style>

    // main.js
    import Alert from './Alert.vue'

    new Vue({
      el: 'body',
      components: { Alert }
    })

code：<https://gist.github.com/laracasts/c1e10280293144f79b4e>

### 22 - Vue Mixins

> Mixins in Vue are very much like PHP traits. Create an object, mix it into an existing Vue instance, and, badabing-badaboom, you now have new re-usable functionality. 

mixins 像是 hook 和 swift 的 extension 的功能合体。

## Note Part 2

This part note is record for [vuejs 1.x official document](http://vuejs.org.cn/guide/).

2016/7/22，开始看 vuejs 1.0 的官方文档，只记录上面视频没有讲到的内容。

### 起步

### 概述

### Vue 实例

Vue 的生命周期：created，beforeCompile，compiled，ready，beforeDestory，destoryed。

加 $ 的对象：`vm.$el`，`vm.$data`。(还记得这个吗： `{{ $data | json }}`)

### 数据绑定语法

插值：

- 文本，使用双括号：`<span> {{ msg }} </span>`
- 原始的 html，使用三括号：`<div> {{{ raw_html }}} </div>`

绑定表达式，只能是简单的表达式，不能是 js 语句：`{{ number + 1 }}`

过滤器：`{{ message | filterA | filterB }}`

指令：`v-if`，`v-show`，`v-else`

参数：

- `v-bind:herf`：`<a v-bind:href="url"></a>`
- `v-on:click`

`v-bind` 指令用于响应地更新 html 特性，而 `v-on` 则是用于监听 DOM 事件。

`v-bind:href="url"` 与 `href="{{url}}"` 等价，实际后者在内部会转换成前者。

修饰符：`v-on:click.prevent`

缩写：

- `v-bind:href` --> `:href`
- `v-on:click` --> `@click`

### 计算属性

computed, get, set。优先使用计算属性，而不是 $watch。

### Class 与 Style 的绑定

字符串拼接麻烦又易错。因此，在 `v-bind` 用于 class 和 style 时，Vue.js 专门增强了它。表达式的结果类型除了字符串之外，还可以是对象或数组。

    <div class="static" v-bind:class="{ 'class-a': isA, 'class-b': isB }"></div>
    <div v-bind:class="[classA, { classB: isB, classC: isC }]">
    <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

当 `v-bind:style` 使用需要厂商前缀的 CSS 属性时，如 transform，Vue.js 会自动侦测并添加相应的前缀。(这么牛叉)

### 条件渲染

`v-if`，`v-show`，`v-else`

- `v-if` 为 false 时，dom 为从 dom-tree 中移除
- `v-show` 为 false 时，dom 的 display 为 none

`v-if` 可以作用在 template 上，如 `<template v-if="ok">`，而 `v-show` 不能作用在 template 上。

### 列表渲染

`v-for`

数组变动检测：`track-by`, `$index`。

因为 JavaScript 的限制，Vue.js 不能检测到下面数组变化：

- 直接用索引设置元素，如 `vm.items[0] = {}`
- 修改数据的长度，如 `vm.items.length = 0`

前者为 Vue 扩展的方法 `$set()` 解决，后者用 `vm.items = []` 解决。

Vue 的另一个扩展方法 `$remove()`。(所以，以 $ 开头的方法都是 Vue 内置或扩展的方法)

`v-for` 不仅可以作用在 array 上，也可以作用在 object 上。

    <ul id="repeat-object" class="demo">
      <li v-for="value in object">
        {{ $key }} : {{ value }}
      </li>
    </ul>

### 方法与事件处理器

- v-on:click.prevent
- v-on:submit.prevent
- v-on:keyup.enter

### 表单控件绑定

接收输入时，用 v-model 将输入值与 model 绑定。

    <input type=" text | checkbox | radio | ...

lazy / number / debounce

### 过渡

其实是说动画啦。vue 实现动画的各种方法。详情略。

### 组件

- Vue.component() 
- Vue.extend()

具体细节的内容好多，暂略，需要时再细看。

### 深入响应式原理

略。

### 自定义指令

    Vue.directive('my-directive', ...)

略。

### 自定义过滤器

    Vue.filter('my-filter', ...)

### 混合

就是上一个教程里讲到的 Mixins 啦。详情略。

### 插件

如何开发插件，略。

使用插件：`Vue.use(somePlugin)`

现在已有的一些插件：vue-router，vue-resource，vue-validator...

### 构建大型应用

模块化：`.vue` 文件。

和 webpack, vue-router, vuex 等配合使用。

DONE~!
