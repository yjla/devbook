# 深浅拷贝



## 浅拷贝

浅拷贝只复制了一层的属性和方法。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

### 实现方式

- `Object.assign` 方法
- 展开语法
- `Array.prototype.slice` 方法
- `Array.prototype.concat` 方法



## 深拷贝

深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象。

- `JSON.parse(JSON.stringify())`，但这种方法有两个问题：
  - 无法拷贝函数和一些特殊的对象如 `RegExp`，`Date`
  - 无法解决循环引用的问题
- lodash 库的 _.cloneDeep 方法



### 实现

```js
const cloneDeep = (obj, map = new Map()) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  const newObj = Array.isArray(obj) ? [] : {};
  map.set(obj, newObj);
  const keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
  for (const k of keys) newObj[k] = cloneDeep(obj[k], map);
  return newObj;
}
```



### 参考

1. [如何写出一个惊艳面试官的深拷贝? - 掘金](https://juejin.cn/post/6844903929705136141)
2. [63. 手写`_.cloneDeep()` | BFE.dev - 前端刷题，准备前端面试拿到心仪的Offer。](https://bigfrontend.dev/zh/problem/create-cloneDeep)
3. [浅拷贝与深拷贝 - 掘金](https://juejin.cn/post/6844904197595332622)