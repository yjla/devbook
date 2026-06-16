# 事件委托的优点

事件委托（delegation）本质上是利用了事件冒泡的机制，把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。

优点：

- 使用事件代理后，不必要为每一个子元素都绑定一个监听事件，减少了内存上的消耗。
- 事件代理可以实现事件的动态绑定，比如，新增了一个子节点，不需要单独地为它添加一个监听事件，它所发生的事件会交给父元素中的监听函数来处理。



## 参考

1. [事件介绍 - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events)[事件参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Events)
2. [事件模型 - JavaScript 教程 - 网道](https://wangdoc.com/javascript/events/model.html)

