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
