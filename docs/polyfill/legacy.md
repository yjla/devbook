---
sidebar_position: 12
sidebar_label: 代码题 (旧)
---

# 代码题 (旧)

:::warning
2022 年面试备战时期的旧索引，内容待逐步重构或归档，新整理的内容见本分类下各篇文章。
:::



## 数组

1. [数组扁平化](/javascript/ES5/数组/flat)
2. [数组去重](/javascript/ES5/数组/deduplicate)
3. [实现 Array.prototype.map](/javascript/ES5/数组/map)
4. [实现 Array.prototype.reduce](/javascript/ES5/数组/reduce)



## 函数

1. [实现 curry 函数](/javascript/ES5/函数/curry)⭐
2. [实现 Function.prototype.call](/javascript/ES5/函数/this)⭐
3. [实现 Function.prototype.apply](/javascript/ES5/函数/this)
4. [实现 Function.prototype.bind](/javascript/ES5/函数/this)



## 对象

1. [实现 new 运算符](/javascript/ES5/对象/new)⭐
2. [实现 instanceof 运算符⭐](/javascript/ES5/对象/instanceof)
3. 六种继承
4. [实现深拷贝](/javascript/ES5/对象/clone)⭐



## 设计模式

1. 实现观察者模式
2. 实现 EventEmitter
3. 工厂
4. 单例
5. 装饰



## 定时器

1. 实现防抖函数⭐
2. 实现节流函数⭐
3. 用 setTimeout 实现 setInterval
4. 用 setInterval 实现 setTimeout
5. 实现 sleep 函数



## Promise

1. 实现 Promise/A+⭐
2. 实现 Promise.all⭐
3. 实现 Promise.race⭐
4. 实现 Promise.allSettled⭐
5. 实现 Promise.any⭐
6. 实现 promisify⭐
7. Promise 串行
8. 自动重传⭐
9. 异步调度器



## 框架

双向绑定

响应式

全局状态管理







### 原生 AJAX

AJAX 是异步的 JavaScript 和 XML（Asynchronous JavaScript And XML）。AJAX 可以在不重新刷新页面的情况下与服务器通信，交换数据（JSON，XML，HTML和 text 文本等格式），或更新页面。AJAX 请求会在请求头中加入 `X-Requested-With: XMLHttpRequest` 字段

AJAX 使用 `XMLHttpRequest` 对象与服务器通信，通信步骤：

1. 创建 `XMLHttpRequest` 实例
2. 创建HTTP请求，设置请求头信息
3. 设置监听函数，也就是请求成功/失败后的操作
4. 发送 HTTP 请求

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.example.org/index.html'); // 请求方法，请求地址，默认异步
xhr.onreadystatechange = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            console.log(httpRequest.responseText);
        } else {
            console.error('There was a problem with the request.');
        }
    }
};
xhr.send();
```

[从服务器获取数据 - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data)

[Ajax - Web 开发者指南 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX)

[HTTP Headers - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)

[XMLHttpRequest 对象 - JavaScript 教程 - 网道](https://wangdoc.com/javascript/bom/xmlhttprequest.html#xmlhttprequestopen)





### 正则表达式

正则表达式（regular expression）可以理解为有特殊规则的字符串模板，用于字符串匹配。

- 匹配字符
  - 横向模糊匹配
  - 纵向模糊匹配
  - 多选分支
- 匹配位置
- 正则表达式方法：`test`、`exec`
- 字符串方法：`match`、`search`、`replace`、`split`

[正则表达式 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)

[RegExp 对象 - JavaScript 教程 - 网道](https://wangdoc.com/javascript/stdlib/regexp.html)

[正则的扩展 - ECMAScript 6入门](https://es6.ruanyifeng.com/#docs/regex)

[JS正则表达式完整教程（略长） - 掘金](https://juejin.cn/post/6844903487155732494)

#### 常用正则表达式

```js
// （2）匹配日期，如 yyyy-mm-dd 格式
var regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

// （3）匹配 qq 号
var regex = /^[1-9][0-9]{4,10}$/g;

// （4）手机号码正则
var regex = /^1[34578]\d{9}$/g;
var phoneReg = /^1[3-9][0-9]{9}$/; 
// ^表示以什么为开头，[^]表示除了，$表示以什么为结尾，{9}表示匹配长度为9
```

#### 去除字符串首尾空格

```js
function removeSpace(str){
    return str.replace(/^\s+|\s+$/g,'');
}

// 测试
let str = '  abc  ';
console.log(removeSpace(str));
```

#### 驼峰和下划线转换

```js
// 下划线转换驼峰
function toHump(str) {
    return str.replace(/\_(\w)/g, function(match, $1){
        console.log($1);
        return $1.toUpperCase();
    });
}
// 驼峰转换下划线
function toLine(str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

// 测试
let a = 'a_b2_345_c2345';
console.log(toHump(a));
 
let b = 'aBdaNf';
console.log(toLine(b));
```



实现 JSONP





### 实现发布-订阅模式

 模拟发送请求 ，只取最后一次的结果，前面的promise还没完成的话就取消 

```js
function wrap(){
    // your code
}

let count=0;
function sendRequest(){
    return new Promise((resolve)=>{
        setTimeout(()=>{
         resolve(++count)   
        })
    });
}
let newWrap = wrap(sendRequest);
newWrap().then(console.log) 
newWrap().then(console.log) 
newWrap().then(console.log) //输出3
```

作者：Callest
链接：https://www.nowcoder.com/discuss/828179?type=2&order=3&pos=835&page=1&source_id=discuss_center_2_nctrack&channel=1009&ncTraceId=9da0d423c90e4cbca298d31349ced3c3.276.16439514093875756&gio_id=4040E56E283C0EE7B0147917386D2091-1643931081391
来源：牛客网





## 设计

### 具有全选和反选功能的多选框（快手）

```html
<body>
	<div id="app">
		<input type="checkbox" ref="all" @click="chooseAll"><span>全选</span>
		<input type="checkbox" ref="inverse" @click="chooseInverse"><span>反选</span>
		<div v-for="item in choices">
			<input type="checkbox" ref="choice" @click="choose(item)">
			<span>{{item}}</span>
		</div>
	</div>

	<script>
		Vue.createApp({
			data() {
				return {
					choices: ['bike', 'car', 'bus', 'motor'],
					selected: []
				}
			},
			methods: {
				choose(item) {
					if (this.selected.includes(item)) {
						this.selected.splice(this.selected.indexOf(item), 1);
					} else {	
						this.selected.push(item);
					}
					if (this.choices.length === this.selected.length) {
						this.$refs.all.checked = true;
					} else {
						this.$refs.all.checked = false;
					}
					// console.log(this.selected)
				},
				chooseAll() {
					if (this.$refs.all.checked === true) {
						this.selected = [...this.choices];
						this.$refs.choice.forEach(value => value.checked = true);
					} else {
						this.selected = [];
						this.$refs.choice.forEach(value => value.checked = false);
					}
				},
				chooseInverse() {
					const arr = [];
					this.choices.forEach(value => {
						if (!this.selected.includes(value)) arr.push(value);
					});
					this.selected = [...arr];
					this.$refs.choice.forEach(value => value.checked = !value.checked);
					if (this.choices.length === this.selected.length) {
						this.$refs.all.checked = true;
					} else {
						this.$refs.all.checked = false;
					}
				}
			}
		}).mount('#app');
	</script>
</body>
```

[vue实现单选多选反选全选全不选](https://segmentfault.com/a/1190000016313367)



### 验证码倒计时按钮（快手）

```html
<body>
	<div id="app">
		<button :disabled=isDisabled @click="frozen()">{{content}}</button>
	</div>

	<script>
		Vue.createApp({
			data() {
				return {
					countdown: 60,
					isDisabled: false,
					content: '发送'
				}
			},
			methods: {
				frozen() {
					this.isDisabled = true;
					this.content = this.countdown + 's';
					let timer = setInterval(() => {
						this.content = --this.countdown + 's';
						if (this.countdown === 0) {
							this.countdown = 60;
							this.isDisabled = false;
							this.content = '发送';
							clearInterval(timer);
						}
					}, 1000);
				}
			}
		}).mount('#app');
	</script>
</body>
```

[Vue：获取验证码按钮倒倒计时效果 - kkxx_Lucca - 博客园](https://www.cnblogs.com/xxzb/p/13370622.html)





### 发布订阅和观察者模式的区别？

在观察者模式中，观察者直接订阅目标事件。而在发布订阅模式中，发布者和订阅者之间多了一个调度中心。调度中心一方面从发布者接收事件，另一方面向订阅者发布事件。在发布订阅模式中，组件之间松耦合。而观察者模式中，组件之间强耦合。

[【JS设计模式】观察者模式VS发布订阅模式](https://zhuanlan.zhihu.com/p/351750593)



[手写Promise 基础之观察者模式](https://zhuanlan.zhihu.com/p/114858951)

[手写发布订阅模式（手写系列二）](https://zhuanlan.zhihu.com/p/210218462)



## 参考

1. [BFE.dev](https://bigfrontend.dev/zh)
2. [awesome-coding-js](http://www.conardli.top/docs/)
