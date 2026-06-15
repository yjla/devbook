## JSONP

```js
function jsonp(url) {
    return new Promise((resolve, reject) => {
        let callbackName = `jsonp_${Date.now()}`; // 一定要为回调函数设置不同的函数名，否则同时执行jsonp的时候传出的数据会冲突
        window[callbackName] = (data) => resolve(data);
        let script = document.createElement('script');
        script.src = url;
        script.onerror = () => reject('jsonp error');
        document.head.appendChild(script);
        document.head.removeChild(script);
    });
}
```



## 参考

1. [ajax同源限制及jsonp解决](https://zhuanlan.zhihu.com/p/146655883)