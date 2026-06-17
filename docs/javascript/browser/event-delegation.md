# 事件委托

事件委托（delegation）本质上是利用了事件冒泡的机制，把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。

这样做有两个好处：一是不必为每个子元素单独绑定监听，减少内存消耗；二是支持**动态绑定**——新增的子节点无需额外绑定，它产生的事件会自动冒泡到父元素被统一处理。

```js
// 不必给每个 <li> 绑定，只在父 <ul> 上监听一次
document.querySelector('ul').addEventListener('click', (e) => {
  // 用 e.target 判断真正被点击的子元素
  if (e.target.tagName === 'LI') {
    console.log('点击了', e.target.textContent);
  }
});
```

## 参考

1. [事件介绍 - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events)[事件参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Events)
2. [事件模型 - JavaScript 教程 - 网道](https://wangdoc.com/javascript/events/model.html)

