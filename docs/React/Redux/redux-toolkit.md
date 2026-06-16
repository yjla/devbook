---
sidebar_position: 4
sidebar_label: 4 Redux Toolkit
---

# Redux Toolkit (RTK)

**RTK 是官方钦定的 Redux 标准写法。** 现在写 Redux 就该用 RTK，不该再手写 action types、action creators、`switch` reducer。

## 为什么用 RTK

传统 Redux 被诟病的三宗罪，RTK 一一对症下药：

| 痛点 | 传统 Redux | RTK 怎么解决 |
|------|-----------|-------------|
| **样板代码多** | 一个功能要写 action type 常量 + action creator + reducer 三份 | `createSlice` 一次性自动生成 |
| **手写 immutable 易错** | 必须 `{ ...state, ... }` 层层展开，深层嵌套极易漏 | 内置 **Immer**，可「直接修改」state |
| **配置繁琐** | `createStore` + 手动接 thunk + 手动接 DevTools | `configureStore` 默认全配好 |

直观感受一下同一个 counter，两种写法的差距：

```js
// ===== 传统 Redux：啰嗦 =====
const INCREMENT = 'counter/increment';
const increment = () => ({ type: INCREMENT });

function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 }; // 必须返回新对象
    default:
      return state;
  }
}

// ===== RTK：清爽 =====
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // 直接改！Immer 在背后帮你生成新对象
    },
  },
});
export const { increment } = counterSlice.actions; // action creator 自动生成
```

## configureStore：一行配好 store

替代 `createStore`，**默认就接好了 redux-thunk、Redux DevTools，并开启 immutable / 序列化检查**。

```js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer, // 等价于自动帮你 combineReducers
    user: userReducer,
  },
});
```

## createSlice：核心 API

一个 slice = 一块状态 + 操作它的 reducers。`createSlice` 吃一个配置，吐出 **reducer + 一组 action creators**。

```js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos', // 决定 action type 前缀，如 'todos/added'
  initialState: [],
  reducers: {
    // 第一个参数 state，第二个参数 action
    added: (state, action) => {
      // 看似直接 push 改了数组，实则 Immer 在底层产出新数组
      state.push({ id: action.payload.id, text: action.payload.text, done: false });
    },
    toggled: (state, action) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) todo.done = !todo.done; // 直接改字段
    },
  },
});

export const { added, toggled } = todosSlice.actions; // 自动生成的 action creators
export default todosSlice.reducer;

// 用法：dispatch(added({ id: 1, text: '学 RTK' }))
```

:::info
**为什么能「直接修改」state？** 因为 createSlice 内部用了 [Immer](https://immerjs.github.io/immer/)。你拿到的 `state` 是一个被代理 (Proxy) 的草稿对象 (draft)，你对它的所有「修改」都被记录下来，Immer 据此生成一个全新的不可变对象返回。所以你写的是「可变」代码，得到的却是「不可变」结果——既好写又安全。注意：**这个特性只在 createSlice / createReducer 内部有效**，不要在外面这么写。
:::

## createAsyncThunk：处理异步

把「发请求」这个异步流程标准化，自动派发 `pending / fulfilled / rejected` 三个 action，省去手写三个 type。

```js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 第一参数：action type 前缀；第二参数：返回 Promise 的函数
export const fetchUser = createAsyncThunk('user/fetch', async (userId) => {
  const res = await fetch(`/api/users/${userId}`);
  return res.json(); // 返回值会成为 fulfilled action 的 payload
});

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle' },
  reducers: {},
  // 用 extraReducers 监听 createAsyncThunk 自动生成的三个 action
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

// 用法：dispatch(fetchUser(1))
```

## RTK Query 简介

RTK Query 是 RTK 自带的**数据请求与缓存方案**，类似 SWR / React Query，但和 Redux 深度集成。它把「请求 + 缓存 + 加载态 + 重新验证」全包了，你只声明接口，它自动生成 hooks。

```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUser: builder.query({ query: (id) => `/users/${id}` }),
  }),
});

// RTK Query 自动生成了 useGetUserQuery 这个 hook
export const { useGetUserQuery } = api;

// 组件里直接用，loading / error / 缓存全自动
function User({ id }) {
  const { data, isLoading, error } = useGetUserQuery(id);
  if (isLoading) return '加载中...';
  return <div>{data.name}</div>;
}
```

:::tip
选型建议：**状态管理用 createSlice，简单异步用 createAsyncThunk，纯粹的服务端数据请求 / 缓存优先用 RTK Query**——它能省掉你手写一大堆 loading / error / 缓存失效逻辑。
:::

## 参考

1. [Redux Toolkit 官方文档](https://cn.redux-toolkit.js.org/)
2. [createSlice - RTK](https://cn.redux-toolkit.js.org/api/createSlice)
3. [RTK Query 概述](https://cn.redux-toolkit.js.org/rtk-query/overview)

## 一句话口诀

> **RTK 是 Redux 官方标准写法：configureStore 一行配好 store + thunk + DevTools，createSlice 自动生成 action 和 reducer 并靠 Immer 让你「直接改」state，createAsyncThunk 标准化异步的 pending/fulfilled/rejected，RTK Query 一站式搞定请求与缓存。**
