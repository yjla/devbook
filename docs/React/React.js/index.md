# React.js

1. React 18 新特性？concurrent legacy



## 全局 API

1. [cloneElement 的作用？](https://zh-hans.reactjs.org/docs/react-api.html#cloneelement)
2. [React.memo 的作用？](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo)



## 组件

1. [JSX 的本质？](https://zh-hans.reactjs.org/docs/jsx-in-depth.html)
1. [JSX 可以防止注入攻击吗？](https://zh-hans.reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks)
1. [函数组件和 class 组件的区别？](https://zh-hans.reactjs.org/docs/components-and-props.html#function-and-class-components)函数组件容易产生闭包陷阱，每次重新渲染都会整体执行
1. [受控组件和非受控组件的区别？](https://zh-hans.reactjs.org/docs/glossary.html#%E5%8F%97%E6%8E%A7%E7%BB%84%E4%BB%B6-vs-%E9%9D%9E%E5%8F%97%E6%8E%A7%E7%BB%84%E4%BB%B6)
1. [React.Component 和 React.PureComponent 的区别？](https://zh-hans.reactjs.org/docs/react-api.html#reactpurecomponent)浅比较
1. [React 组件通信的方式有哪些？](./组件通信)
1. [渲染属性的作用？](https://zh-hans.reactjs.org/docs/render-props.html)
1. React 组件的生命周期方法有哪些？
1. React 中有哪些浅比较？
1. 如何继承组件？
1. 错误边界？
1. fragments
1. 传送门
1. 哪些情况下组件会重新渲染？state和props变化；父组件重新渲染。使用纯函数可以使子组件跳过更新（子组件不更新）
1. React.memo 的作用？
1. React.forwardRef 的作用？
1. [如何理解单向数据流？](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html#the-data-flows-down)
1. refs的作用
1. HOC 的使用场景



## 状态

1. setState 背后的原理？批量异步更新
2. 直接更新 state 会引发什么问题？
3. [组件更新的原理？](https://zh-hans.reactjs.org/docs/implementation-notes.html#updating)
4. 校验 props？proptypes
5. [state 和 props 的区别？](https://zh-hans.reactjs.org/docs/faq-state.html#what-is-the-difference-between-state-and-props)
6. [setState 会立即更新组件吗？](https://zh-hans.reactjs.org/docs/react-component.html#setstate)
7. [为什么 state 需要批量异步更新？](https://zh-hans.reactjs.org/docs/faq-state.html#when-is-setstate-asynchronous)
8. [如何让 state 同步更新？](https://zh-hans.reactjs.org/docs/faq-state.html#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate)
9. setState 第二个参数的作用？
10. setState 设置状态两种写法？
10. [如何理解状态不可变？](https://beta.reactjs.org/learn/updating-objects-in-state)
10. [为什么数据不可变？](https://beta.reactjs.org/learn/updating-objects-in-state)
10. [Use-immer 的作用](https://beta.reactjs.org/learn/updating-objects-in-state)



## 生命周期

1. [组件的生命周期？](https://zh-hans.reactjs.org/docs/react-component.html#the-component-lifecycle)
1. [有哪些过时的生命周期方法？](https://zh-hans.reactjs.org/docs/react-component.html#legacy-lifecycle-methods)
1. [网络请求会放在哪个生命周期？](https://zh-hans.reactjs.org/docs/react-component.html#componentdidmount)
1. [shouldComponentUpdate 返回 false 能否阻止子组件重新渲染？](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)



## Hook

1. [Hook 解决了哪些痛点？](https://zh-hans.reactjs.org/docs/hooks-intro.html#motivation)
2. [常用的 Hook 有哪些？](https://zh-hans.reactjs.org/docs/hooks-reference.html)
3. [useState 的作用？](https://zh-hans.reactjs.org/docs/hooks-state.html#declaring-a-state-variable)
4. [useEffect 的作用？](https://zh-hans.reactjs.org/docs/hooks-effect.html#example-using-hooks)
9. [effect 的执行时机？](https://zh-hans.reactjs.org/docs/hooks-reference.html#timing-of-effects)
10. effect 条件执行是浅层比较还是深层比较？浅层
11. useState 惰性渲染？
12. [哪些副作用需要被清除？](https://zh-hans.reactjs.org/docs/hooks-effect.html#%E9%9C%80%E8%A6%81%E6%B8%85%E9%99%A4%E7%9A%84-effect)
13. [为什么每次更新的时候都要运行 Effect？](https://zh-hans.reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)
14. 只能在顶层使用 Hook
15. useEffect 与 useLayoutEffect 的区别
16. useCallback 和 useMemo 的区别？
17. [useEffect 闭包陷阱产生场景？](./useEffect)
18. [useEffect 闭包陷阱解决办法？](./useEffect)
19. hook 与生命周期的对应
20. 什么是自定义 Hooks
21. 如何在组件之间重用逻辑
22. 何时以及为何提取自定义 Hook

https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks



## 源码

1. React 源码架构？
2. 什么是虚拟 DOM？
3. Diff 算法的原理？
4. React key 的作用？
5. React.createElement 的原理？
6. [什么是 Fiber？](./Fiber)
7. 什么是时间分片？



## 其他



#### 尾调用

尾调用指的是函数的最后一步返回另一个函数。我们代码执行是基于执行栈的，因此如果在函数`A`的内部调用函数`B`，那么会在`A`的执行上下文上方形成一个`B`的执行上下文。如果`B`是尾调用的话，由于它已经是函数的最后一步了，因此不必再保留`A`的执行上下文，而是直接用`B`的执行上下文取代`A`的执行上下文，这样就不用再创建`B`的执行上下文了。这样不仅速度快，而且节省内存。

[函数的扩展 - ECMAScript 6入门](https://es6.ruanyifeng.com/#docs/function)

#### 柯里化

函数柯里化指的是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

```js
function curry(fn) {
  return function currify(...args) {
    // console.log(this);
    return args.length >= fn.length ?
      fn.apply(this, args) :
    currify.bind(this, ...args); // 一开始只是绑参数，绑完再apply执行
  }
}

// test
function sum(a, b, c) {
    return a + b + c;
}

let currySum = curry(sum);
console.log(currySum(1)(2)(3));
console.log(currySum(1, 2)(3));
```

[前端面试题——函数柯里化](https://zhuanlan.zhihu.com/p/107265520)

[JavaScript函数柯里化](https://zhuanlan.zhihu.com/p/31271179)