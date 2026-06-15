# 保存页面状态

要保存页面的当前的状态，本质上是保存组件的状态，有以下两种情况：

- 组件被卸载
- 组件未被卸载



## 组件被卸载

### Storage API

组件即将被销毁时，在相应的的生命周期钩子（Vue 的 `beforeUnmount`和 React 的 `componentWillUnmount`）中，通过 ` JSON.stringify()` 把当前页面的状态存储在 Storage API （LocalStorage 或 SessionStorage）中。

假如有以下场景：从 B 组件跳转到 A 组件的时候，A 组件需要根据 B 组件的状态，更新自身的状态；但是如果从 C 组件跳转到 B 组件的时候，希望 B 组件重新渲染的，也就是 A 组件不从 Storage API 中读取 B 组件的状态，也重新渲染。这时，我们可以在 Storage API 中加入一个 `flag`，用来控制 A 组件是否读取 Storage API 中 B 组件的状态。

#### 优点

- 兼容性好，不需要额外库或工具。
- 简单快捷，基本可以满足大部分需求。

#### 缺点

- 状态通过 JSON 储存，这就意味着，对于像 `Date` 对象、`Regexp` 对象等属性，会得到字符串，而不是原来的值。
- 如果 B 组件后退或者下一页跳转并不是前组件，那么 `flag` 判断会失效，导致从其他页面进入 A 组件时，A 组件会重新读取 Storage API

### 路由传值

通过 react-router 的 Link 组件的 prop —— to 可以实现路由间传递参数的效果。

在这里需要用到 state 参数，在 B 组件中通过 history.location.state 就可以拿到 state 值，保存它。返回 A 组件时再次携带 state 达到路由状态保持的效果。

https://router.vuejs.org/zh/guide/essentials/passing-props.html

**优点：**

- 简单快捷，不会污染 LocalStorage / SessionStorage。
- 可以传递 Date、RegExp 等特殊对象（不用担心 JSON.stringify / parse 的不足）

**缺点：**

- 如果 A 组件可以跳转至多个组件，那么在每一个跳转组件内都要写相同的逻辑。



## 组件未被卸载

### 单页面渲染

要切换的组件作为子组件全屏渲染，父组件中正常储存页面状态。

**优点：**

- 代码量少
- 不需要考虑状态传递过程中的错误

**缺点：**

- 增加 A 组件维护成本
- 需要传入额外的 prop 到 B 组件
- 无法利用路由定位页面

### `keep-alive`

除此之外，在Vue中，还可以是用keep-alive来缓存页面，当组件在keep-alive内被切换时组件的**activated、deactivated**这两个生命周期钩子函数会被执行 被包裹在keep-alive中的组件的状态将会被保留：

```javascript
<keep-alive>
	<router-view v-if="$route.meta.keepAlive"></router-view>
</kepp-alive>
复制代码
```

**router.js**

```javascript
{
  path: '/',
  name: 'xxx',
  component: ()=>import('../src/views/xxx.vue'),
  meta:{
    keepAlive: true // 需要被缓存
  }
},
```

