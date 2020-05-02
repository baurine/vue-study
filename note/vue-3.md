# Vue 3

## Vue Function-based API RFC

- [Vue Function-based API RFC](https://zhuanlan.zhihu.com/p/68477600)
- [Vue Composition API RFC](https://vue-composition-api-rfc.netlify.com/)
- [Vue 3.0 最新进展，Composition API](https://juejin.im/post/5d836458f265da03d871f6e9)
- [精读《Vue3.0 Function API》](https://zhuanlan.zhihu.com/p/71667382)

Vue Function-based API 后来改名成 Vue Composition API 并对一些 API 进行了重新命名 (composition 这个词用得很贴切)。其使用方式和 React Hooks 很想似，如果熟悉 React Hooks 的话，Vue Composition API 就很好理解。

Vue Composition API 将会是 Vue 3.0 最重要的特性。

react 和 vue 的相继改变体现了用 "组合替代继承" 来实现复用。

(Go 和 Rust 也是用组合替代继承)

示例代码：

```js
// 组合函数，Composition API，将相关联的逻辑组合在一个函数中
// 然后在可以在多个组件中复用了
function useMouse() {
  const x = value(0)
  const y = value(0)
  const update = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })
  return { x, y }
}

// 在组件中使用该函数
const Component = {
  setup() {
    const { x, y } = useMouse()
    // 与其它函数配合使用
    const { z } = useOtherLogic()
    return { x, y, z }
  },
  template: `<div>{{ x }} {{ y }} {{ z }}</div>`,
}
```

> Function-based API 受 React Hooks 的启发，提供了一个全新的逻辑复用方案，且不存在上述问题。使用基于函数的 API，我们可以将相关联的代码抽取到一个 "composition function"（组合函数）中 —— 该函数封装了相关联的逻辑，并将需要暴露给组件的状态以响应式的数据源的方式返回出来。

Vue 3.0 将全部使用 TypeScript 开发。

### 设计细节

一个更完整的例子示例代码：

```js
import { value, computed, watch, onMounted } from 'vue'

const App = {
  template: `
    <div>
      <span>count is {{ count }}</span>
      <span>plusOne is {{ plusOne }}</span>
      <button @click="increment">count++</button>
    </div>
  `,
  setup() {
    // reactive state
    const count = value(0)
    // computed state
    const plusOne = computed(() => count.value + 1)
    // method
    const increment = () => {
      count.value++
    }
    // watch
    watch(
      () => count.value * 2,
      (val) => {
        console.log(`count * 2 is ${val}`)
      }
    )
    // lifecycle
    onMounted(() => {
      console.log(`mounted`)
    })
    // expose bindings on render context
    return {
      count,
      plusOne,
      increment,
    }
  },
}
```

重点函数：

- setup()
- value() - 类似 react hooks 中 useRef
- computed() - 类似 react hooks 中的 useMemo
- watch() - 类似 react hooks 中的 useEffect

#### setup() 函数

setup() 是组件用于放置组件逻辑的地方 (所以它只能在 component 中使用)，是 component 中最重要的函数。它会在一个组件实例被创建时，初始化了 props 之后调用。setup() 会接收到初始的 props 作为参数。setup() 可以返回一个对象，这个对象将会暴露给模版的渲染上下文，类似原来的 data() 方法。

```js
const MyComponent = {
  props: {
    name: String,
  },
  setup(props) {
    return {
      msg: `hello ${props.name}!`,
    }
  },
  template: `<div>{{ msg }}</div>`,
}
```

如果想在 setup() 中创建一个可以被管理的值，使用 value() 函数。

```js
import { value } from 'vue'

const MyComponent = {
  setup(props) {
    const msg = value('hello')
    const appendName = () => {
      msg.value = `hello ${props.name}`
    }
    return {
      msg,
      appendName,
    }
  },
  template: `<div @click="appendName">{{ msg }}</div>`,
}
```

value() 返回的是一个 value wrapper（包装对象）。一个包装对象只有一个属性：.value ，该属性指向内部被包装的值。为什么要包装，是为了获得不变的引用，追踪它内部值的变化，因为像 number/string 这种基本类型只有值，没有引用。

当包装对象被暴露给模版渲染上下文，或是被嵌套在另一个响应式对象中的时候，它会被自动展开 (unwrap) 为内部的值，不需要显示地调用 `.value` 属性。

如果想创建一个没有包装的响应式对象，使用 state() 函数。

```js
import { state } from 'vue'

const object = state({
  count: 0,
})

object.count++
```

#### computed() - 计算值

```js
import { value, computed } from 'vue'

const count = value(0)
const countPlusOne = computed(() => count.value + 1)

console.log(countPlusOne.value) // 1

count.value++
console.log(countPlusOne.value) // 2
```

只有当依赖变化时才会被重新计算。

#### watch() - Watcher (重要)

watch() API 提供了基于观察状态的变化来执行副作用的能力。

```js
watch(
  // getter
  () => count.value + 1,
  // callback
  (value, oldValue) => {
    console.log('count + 1 is: ', value)
  }
)
// -> count + 1 is: 1

count.value++
// -> count + 1 is: 2
```

比如当 props.id 变化时，重新去 fetch。

```js
const MyComponent = {
  props: {
    id: Number,
  },
  setup(props) {
    const data = value(null)
    watch(
      () => props.id,
      async (id) => {
        data.value = await fetchData(id)
      }
    )
    return {
      data,
    }
  },
}
```

watch 可以直接观察一个包装对象：

```js
// double 是一个计算包装对象
const double = computed(() => count.value * 2)

watch(double, (value) => {
  console.log('double the count is: ', value)
}) // -> double the count is: 0

count.value++ // -> double the count is: 2
```

还可以同时观察多个数据源：

```js
watch([valueA, () => valueB.value], ([a, b], [prevA, prevB]) => {
  console.log(`a is: ${a}`)
  console.log(`b is: ${b}`)
})
```

停止观察，watch() 的返回值是一个停止观察的函数：

```
const stop = watch(...)
stop()
```

清理副作用：正如 react hooks 的 useEffect() 需要返回一个 cleanup 函数一样，watch() 也需要能够清理副作用的函数，在 watch 回调在下一次调用前或 watcher 被停止前调用。

```js
watch(idValue, (id, oldId, onCleanup) => {
  const token = performAsyncOperation(id)
  onCleanup(() => {
    // id 发生了变化，或是 watcher 即将被停止.
    // 取消还未完成的异步操作。
    token.cancel()
  })
})
```

watcher 回调在 DOM 被更新之后调用，和 useEffect 的调用时机是一样的。

#### 生命周期函数

- onMounted
- onUpdated
- onUmounted

(react hooks 已经不需要这些 lifecycle 函数了，vue 仍然保留了，但实际也可以用 watch() 替代吧)

#### 依赖注入

实际作用有点像 react hooks 中的 useContext，有生产者和消费者，在多个组件中共享状态。

```js
import { provide, inject } from 'vue'

const CountSymbol = Symbol()

const Ancestor = {
  setup() {
    // providing a value can make it reactive
    const count = value(0)
    provide({
      [CountSymbol]: count,
    }) // 生产者
  },
}

const Descendent = {
  setup() {
    const count = inject(CountSymbol) // 消费者
    return {
      count,
    }
  },
}
```

> 如果注入的是一个包装对象，则该注入绑定会是响应式的（也就是说，如果 Ancestor 修改了 count，会触发 Descendent 的更新）。

#### 类型推导

使用 createComponent() 函数来定义组件。详略，暂时跳过。

### Composition API 的变化

- state 更名为 reactive
- value 更名为 ref，并提供 isRef() 和 toRefs() 方法
- watch() 可作用于单一函数，自动收集依赖
- computed() 可传入 get 和 set

示例：

```js
const count = ref(0)

watch(() => console.log(count.value)) // 打印 0

setTimeout(() => {
  count.value++ // 打印 1
}, 100)
```

reactive 和 ref 的区别，一般用 ref 包装单个基本类型，比如 `const count = ref(1)`，而用 reactive 包装 object，比如 `const pos = reactive({x: 1, y: 2})`。另外，在组合函数中，返回 reactive 时，要用 toRefs() 将 reactive 对象转换成普通对象 (?? 暂时有点不理解)：

```js
function useMousePosition() {
  const pos = reactive({
    x: 0,
    y: 0,
  })

  // ...
  return toRefs(pos)
}

// x 和 y 现在具备了响应式
const { x, y } = useMousePosition()
```

## Vue 3.0 Beta

- [抄笔记：尤雨溪在 Vue3.0 Beta 直播里聊到了这些](https://juejin.im/post/5e9f6b3251882573a855cd52)
- [Vue3 究竟好在哪里？（和 React Hook 的详细对比）](https://zhuanlan.zhihu.com/p/133819602)

Highlights:

- Performance
- TreeShaking
- Composition API
- Fragment, Teleport (Portal), Suspense
- TypeScript
- Custom Render API

### Performance

1. PatchFlag (评论里说 React 里有对应的 EffectTag? 这是啥)
1. cacheHandlers (对标 React 的 useCallback，但 Vue 3.0 会自动做这件事)

### 新工具 vite

一个简易的 http 服务器，无需 webpack 编译打包，根据请求的 Vue 文件，直接发回渲染，且支持热更新（非常快）。
