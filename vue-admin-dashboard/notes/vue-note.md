# Design+Code Vue Note

## chapter 1 - Intro to Vue.js

安装

先安装 homebrew

再安装 yarn

brew install yarn (自动安装 node)

安装 vue cli

yarn global add @vue/cli

以图形式界面的形式创建 vue project: 

$ vue ui

选择 router / vuex / scss

## chapter 2 - Global Styling with Sass

安装 vscode, vetur 插件

sass:

- $ - 定义变量
- @minix
- @include
- %
- @extend
- @import

## chpater 3 - Single File Components

将 template / js / css 写在同一个 .vue 文件中

## chapter 4 - dark mode

通过在 vue.config.js 中 @import base scss (color/typography)，里面的 css 变量可以在全局使用 (那如果有冲突怎么办?)

通过

    * {
      transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

实现 dark mode 和 light mode 切换时颜色变化有一个过程，而不会太突兀。

## chapter 5 - vuex

store:

- state
- getters
- mutations (sync)
- actions (aysnc)

mutations - reducers

actions - effects

## chapter 6 - animation & transitions

css3 的动画有两种实现：transition 和 animation

toggle switch 的实现很有意思，是通过点击后将 `transform: transferX(0)` 变成 `transform: transferX(90%)`，再加上 `* { transition: ... }` 实现的

box-shadow 通过在最前面加上 inset 可以把阴影显示在 box 内部而不是外部。

将一些 class 从 scope 移到 global 后，优先级发生了变化:

    .light-text[data-v-xxx] > p[data-v-xxx] > .light-text > p

theme 变化，主要是各种 color 的变化，包括前景色 color，背景色 background-color，border-color，box-shadow color...

其它的一般不变，比如 margin/padding，字体，字号

## chapter 7 - netlify signin

路由切换

notification/flash message 的实现，通过在路由切换时传递额外的 params 实现

notification 的动画使用了 animated.css 和 vue 的 `<transition>` component

(这部分记录的不详细，必须把课程 download 下来以便后面复习)

## chapter 8 - forget pwd / request

slack api 这么简单啊  (通过 token/api 发送到 slack 服务器，slack 服务器再转发到 channel，原理就是这么简单)

      // Slack API logic
      let slackURL = new URL("https://slack.com/api/chat.postMessage");

      const data = {
        token: [YOUR OAUTH ACCESS TOKEN]
        channel: "hq",
        text: `${email} has requested admin access to HQ. Please go to Netlify to invite them.`
      };

      slackURL.search = new URLSearchParams(data);

      fetch(slackURL)

另外，构造带 search params 的操作也是第一次见，使用 URLSearchParams(object)，学习了。

## chapter 9 - charts and data visualization

学到了不少第三方服务：netlify / slack / google data studio / charts / firestore / lambda ...

酷炫的图表: Apex Charts (基于 svg 实现的)

## chapter 10 - firebase firestore

熟悉，skip

`this.$binding` 是什么用法?

## chapter 11 - lambda functions netlify

> Netlify Lambda Functions use Amazon Web Services (AWS) Lambda Functions

skip 暂时用不上

done!

## 其它

polish: Header 放到 App 中

像 `v-show="show"`，`v-for="(member, index) in members"`，`:src="memer.img"`，当 key 是 vue 的指令时，后面双引号中的内容可以理解成是 js 代码，反之，就是普通的字符串。

最后的效果:

![](./1-theme.gif)

![](./2-home.gif)
