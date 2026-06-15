---
sidebar_label: 虚拟 DOM 与 diff
---

# 虚拟 DOM 与 diff

虚拟 DOM = **用 JS 对象描述真实 DOM 结构**。数据变化时，先在轻量的 JS 对象上算出「哪里变了」(diff)，再只把变化的部分更新到真实 DOM (patch)，避免整棵重建——这是 React / Vue 性能的基础。直接操作真实 DOM 慢，是因为会触发浏览器的重排重绘；先在 JS 里算差异就便宜得多。

## vnode 结构

一个 vnode 描述一个节点，只需三样：**标签、属性、子节点**。

```js
function h(tag, props, children) {
  return { tag, props: props || {}, children: children || [] };
}

// 描述 div#app 里套一个 span：
const vnode = h('div', { id: 'app' }, [h('span', {}, ['hi'])]);
```

## render：vnode → 真实 DOM

```js
function render(vnode) {
  // 文本节点：直接创建文本
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.tag);

  // 设置属性
  Object.entries(vnode.props).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });

  // 递归渲染子节点并挂上去
  vnode.children.forEach((child) => {
    el.appendChild(render(child));
  });

  return el;
}
```

## diff + patch 的三条核心策略

完整 diff 很复杂，要讲清的是这**三条降复杂度的策略**：

1. **只做同层比较**：两棵树逐层对比，不跨层移动节点——把理论上的 O(n³) 降到 O(n)。
2. **tag 不同就整个替换**：标签都变了，不再深入比较，直接换掉。
3. **tag 相同就比 props、再递归比 children**。

简化版 patch（对比新旧 vnode，把差异更新到真实节点 `el`）：

```js
function patch(el, oldVnode, newVnode) {
  // 1. 类型/标签不同 → 直接替换
  if (
    typeof oldVnode !== typeof newVnode ||
    (typeof newVnode === 'string' && oldVnode !== newVnode) ||
    oldVnode.tag !== newVnode.tag
  ) {
    el.replaceWith(render(newVnode));
    return;
  }

  if (typeof newVnode === 'string') return; // 文本且相同，无需处理

  // 2. 同标签：更新有变化的属性
  patchProps(el, oldVnode.props, newVnode.props);

  // 3. 递归比较子节点
  const oldCh = oldVnode.children;
  const newCh = newVnode.children;
  const len = Math.max(oldCh.length, newCh.length);
  for (let i = 0; i < len; i++) {
    if (!oldCh[i]) {
      el.appendChild(render(newCh[i])); // 新增
    } else if (!newCh[i]) {
      el.removeChild(el.childNodes[i]); // 删除
    } else {
      patch(el.childNodes[i], oldCh[i], newCh[i]); // 递归比较
    }
  }
}

function patchProps(el, oldProps, newProps) {
  // 更新或新增属性
  Object.entries(newProps).forEach(([key, value]) => {
    if (oldProps[key] !== value) el.setAttribute(key, value);
  });
  // 删除"旧的有、新的没有"的属性
  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) el.removeAttribute(key);
  });
}
```

## key 的作用

:::info
列表 diff 时，`key` 是每个节点的「身份证」。**没有 `key`**，框架只能按下标一一对比——在列表头部插入一个元素，会导致后面所有元素都被判定为「变了」而重渲染。**有了唯一 `key`**，框架能认出「这是同一个节点，只是位置变了」，从而复用真实 DOM、只做最小移动。

这正是「列表渲染必须加 `key`、且别拿数组 `index` 当 `key`」的根本原因——用 `index` 当 key，插入/删除后 index 全变，等于没加。
:::

## 一句话口诀

> **虚拟 DOM** = 用 JS 对象描述 DOM，先在 JS 里算差异再最小化更新真实 DOM。
> **diff 三策略**：只比同层、tag 不同直接换、tag 相同比 props 再递归比 children。
> **key** 是节点身份证，让框架认出「移动」而非「重建」，所以列表必加 key、别用 index。
