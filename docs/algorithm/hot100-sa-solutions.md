---
sidebar_position: 1
sidebar_label: S/A 档题解
---

# S/A 档题解（按题号）

[高频刷题清单](./hot100-priority.md) 里 **S 档(25 题)+ A 档(50 题)** 共 75 道的参考解法,按 LeetCode 题号升序排列,方便速查。每题给出档位与 CodeTop 频度、一句话题意、核心思路、可读的 JS 解法和复杂度。

:::tip
解法以**最易理解**为准,不追求最短。按题号查阅;想按优先级刷题回到 [高频刷题清单](./hot100-priority.md)。
:::


### 1 两数之和

`S 档` · 频度 302

哈希表存「值→下标」,遍历时查 target - x 是否出现过。

**思路**:一次遍历,边存边查。对每个数 x,看哈希表里有没有 `target - x`,有就返回两个下标。

```js
function twoSum(nums, target) {
  // 第一步:用 Map 存「已遍历过的值 → 下标」
  const seen = new Map();
  // 第二步:遍历,查补数是否出现过
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 2 两数相加

`A 档` · 频度 133

两条链表逐位相加,用一个变量记进位,模拟竖式加法。

**思路**:同步遍历两链表,每位求和加进位,`sum % 10` 存值,`sum / 10` 进位。用哑结点简化头部处理。注意最后可能还有进位要补一位。

```js
function addTwoNumbers(l1, l2) {
  // 第一步:哑结点开头,cur 指向尾部,carry 记进位
  const dummy = { val: 0, next: null };
  let cur = dummy;
  let carry = 0;
  // 第二步:任一链表没走完,或还有进位,就继续
  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    cur.next = { val: sum % 10, next: null };
    cur = cur.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}
```

**复杂度**:时间 O(max(m, n)),空间 O(max(m, n))。

### 3 无重复字符的最长子串

`S 档` · 频度 1151

滑动窗口 + 哈希表记录每个字符最近出现的位置。

**思路**:右指针扩窗,遇到重复字符就把左指针跳到「该字符上次出现位置 + 1」。窗口内始终无重复,记录最大长度。

```js
function lengthOfLongestSubstring(s) {
  // 第一步:Map 记「字符 → 最近一次下标」,left 是窗口左边界
  const lastSeen = new Map();
  let left = 0;
  let max = 0;
  // 第二步:right 扩窗,遇重复跳 left
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    // 注意:只有重复位置在窗口内才移动 left,否则 left 会倒退
    if (lastSeen.has(c) && lastSeen.get(c) >= left) {
      left = lastSeen.get(c) + 1;
    }
    lastSeen.set(c, right);
    max = Math.max(max, right - left + 1);
  }
  return max;
}
```

**复杂度**:时间 O(n),空间 O(min(n, 字符集大小))。

### 4 寻找两个正序数组的中位数

`A 档` · 频度 171 · hard

在较短数组上二分切割,使左半部分元素个数恰好等于总长一半。

**思路**:对短数组二分一个切点 i,长数组切点 j 由总数推出。调整 i 让「左边最大 ≤ 右边最小」,此时切割合法,中位数由切割边界四个值得出。

```js
function findMedianSortedArrays(nums1, nums2) {
  // 第一步:保证 nums1 是较短的,二分范围更小
  if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
  const m = nums1.length;
  const n = nums2.length;
  const half = Math.floor((m + n + 1) / 2);
  let lo = 0;
  let hi = m;
  // 第二步:二分 nums1 的切点 i
  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2);
    const j = half - i;
    const left1 = i === 0 ? -Infinity : nums1[i - 1];
    const right1 = i === m ? Infinity : nums1[i];
    const left2 = j === 0 ? -Infinity : nums2[j - 1];
    const right2 = j === n ? Infinity : nums2[j];
    // 第三步:切割合法,计算中位数
    if (left1 <= right2 && left2 <= right1) {
      const maxLeft = Math.max(left1, left2);
      if ((m + n) % 2 === 1) return maxLeft;
      const minRight = Math.min(right1, right2);
      return (maxLeft + minRight) / 2;
    } else if (left1 > right2) {
      hi = i - 1; // i 太大,左移
    } else {
      lo = i + 1; // i 太小,右移
    }
  }
  return 0;
}
```

**复杂度**:时间 O(log(min(m, n))),空间 O(1)。

### 5 最长回文子串

`S 档` · 频度 349

中心扩散:枚举每个中心,向两边扩展找最长回文。

**思路**:回文以中心对称,中心可能是单字符（奇数长）或两字符之间（偶数长）。对每个位置都试这两种中心,向外扩展,记录最长区间。

```js
function longestPalindrome(s) {
  let start = 0;
  let maxLen = 0;
  // 第二步:从中心 (l, r) 向两边扩,返回回文长度并更新答案
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--;
      r++;
    }
    const len = r - l - 1; // 跳出循环时 l、r 各多走了一步
    if (len > maxLen) {
      maxLen = len;
      start = l + 1;
    }
  }
  // 第一步:每个位置试奇数中心和偶数中心
  for (let i = 0; i < s.length; i++) {
    expand(i, i); // 奇数:单字符中心
    expand(i, i + 1); // 偶数:双字符中心
  }
  return s.slice(start, start + maxLen);
}
```

**复杂度**:时间 O(n²),空间 O(1)。

### 11 盛最多水的容器

`A 档` · 频度 56

双指针从两端向中间收缩,每次移动较矮的一边。

**思路**:面积 = 较短边 × 宽度。移动较高的一边面积只会变小,只有移动较矮的一边才可能变大,所以每次淘汰矮的那根。

```js
function maxArea(height) {
  // 第一步:左右指针在两端
  let left = 0;
  let right = height.length - 1;
  let max = 0;
  // 第二步:收缩,每次移动较矮的一边
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, area);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 15 三数之和

`S 档` · 频度 478

排序后固定一个数,剩下两个用双指针,注意去重。

**思路**:先排序,枚举第一个数 nums[i],在 i 右侧用左右指针找两数之和为 -nums[i]。三个数都要跳过重复值才能避免重复三元组。

```js
function threeSum(nums) {
  // 第一步:排序,方便双指针和去重
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break; // 最小的都 > 0,无解
    if (i > 0 && nums[i] === nums[i - 1]) continue; // 第一个数去重
    // 第二步:左右指针夹逼
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]]);
        // 第三步:左右指针都要跳过重复
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return res;
}
```

**复杂度**:时间 O(n²),空间 O(1)（不算排序与结果）。

### 19 删除链表的倒数第 N 个结点

`A 档` · 频度 182

快慢指针,快指针先走 N 步,再一起走到末尾。

**思路**:从哑结点出发,快指针先走 n+1 步,这样快慢之间相隔 n+1,当快指针到 null 时,慢指针正好停在待删结点的前一个,便于删除。先走 n+1 是为了让 slow 落在前驱位置。

```js
function removeNthFromEnd(head, n) {
  // 第一步:哑结点,统一处理删头的情况
  const dummy = { val: 0, next: head };
  let fast = dummy;
  let slow = dummy;
  // 第二步:快指针先走 n+1 步,使 slow 最终停在待删结点的前驱
  for (let i = 0; i <= n; i++) fast = fast.next;
  // 第三步:同步前进,直到快指针到末尾
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 20 有效的括号

`S 档` · 频度 295

用栈匹配括号,遇左括号入栈,遇右括号检查栈顶是否配对。

**思路**:左括号压栈,右括号则看栈顶能不能配对,不配对或栈空就非法。最后栈必须为空才说明全部匹配。

```js
function isValid(s) {
  // 第一步:右括号 → 对应左括号的映射
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  // 第二步:遍历,左括号入栈,右括号查栈顶
  for (const c of s) {
    if (c === "(" || c === "[" || c === "{") {
      stack.push(c);
    } else {
      if (stack.pop() !== pairs[c]) return false;
    }
  }
  // 第三步:栈空才说明全部闭合
  return stack.length === 0;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 21 合并两个有序链表

`S 档` · 频度 330

哑结点 + 双指针,每次接上较小的结点。

**思路**:类似归并的合并步骤,比较两链表头,把小的接到结果尾部并前进。哑结点省去头部判断,最后接上剩余部分。

```js
function mergeTwoLists(l1, l2) {
  // 第一步:哑结点 + cur 尾指针
  const dummy = { val: 0, next: null };
  let cur = dummy;
  // 第二步:两链表都非空时,接较小者
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }
  // 第三步:接上剩余非空链表
  cur.next = l1 || l2;
  return dummy.next;
}
```

**复杂度**:时间 O(m + n),空间 O(1)。

### 22 括号生成

`A 档` · 频度 150

回溯:维护已用左右括号数,保证任意时刻右括号不超过左括号。

**思路**:DFS 构造字符串,左括号数 < n 可以放左,右括号数 < 左括号数 可以放右（保证合法）。长度到 2n 收集答案。

```js
function generateParenthesis(n) {
  const res = [];
  // 第一步:回溯,open/close 是已用的左右括号数
  function backtrack(path, open, close) {
    // 第二步:凑够 2n 个字符就收集
    if (path.length === 2 * n) {
      res.push(path);
      return;
    }
    // 第三步:还能放左括号就放
    if (open < n) backtrack(path + "(", open + 1, close);
    // 右括号数不能超过左括号数,否则不合法
    if (close < open) backtrack(path + ")", open, close + 1);
  }
  backtrack("", 0, 0);
  return res;
}
```

**复杂度**:时间 O(4ⁿ / √n)（卡特兰数）,空间 O(n)（递归深度）。

### 23 合并 K 个升序链表

`S 档` · 频度 256 · hard

两两合并（分治），把 K 条链表归并起来。

**思路**:把合并两条有序链表的操作推广,用分治两两配对合并,每轮链表数减半,共 log k 轮。比逐条合并更快。

```js
function mergeKLists(lists) {
  if (lists.length === 0) return null;
  // 第二步:合并两条有序链表（复用 21 题逻辑）
  function merge2(a, b) {
    const dummy = { val: 0, next: null };
    let cur = dummy;
    while (a && b) {
      if (a.val <= b.val) {
        cur.next = a;
        a = a.next;
      } else {
        cur.next = b;
        b = b.next;
      }
      cur = cur.next;
    }
    cur.next = a || b;
    return dummy.next;
  }
  // 第一步:分治,每轮两两合并直到只剩一条
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      merged.push(merge2(lists[i], lists[i + 1] || null));
    }
    lists = merged;
  }
  return lists[0];
}
```

**复杂度**:时间 O(N log k)（N 是总结点数）,空间 O(1)。

### 24 两两交换链表中的节点

`A 档` · 频度 72

哑结点 + 每次处理一对相邻结点的指针重连。

**思路**:用前驱 prev 指向当前要交换的一对 (a, b)。把三根指针重接成 prev→b→a→...,然后 prev 前进两步处理下一对。

```js
function swapPairs(head) {
  // 第一步:哑结点,prev 指向待交换一对的前驱
  const dummy = { val: 0, next: head };
  let prev = dummy;
  // 第二步:存在成对结点才交换
  while (prev.next && prev.next.next) {
    const a = prev.next;
    const b = a.next;
    // 第三步:重接指针 prev → b → a → b.next
    a.next = b.next;
    b.next = a;
    prev.next = b;
    // 第四步:prev 跳到这对的尾部 a,处理下一对
    prev = a;
  }
  return dummy.next;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 25 K 个一组翻转链表

`S 档` · 频度 520 · hard

每凑齐 K 个结点就翻转这一组,不足 K 个保持原样。

**思路**:用 prev 标记每组前驱,先探测后面是否还有 K 个结点,够就翻转这一段并把首尾接回链表,然后 prev 移到这一组翻转后的尾部继续。

```js
function reverseKGroup(head, k) {
  // 第二步:翻转 [head, tail) 区间,返回新头
  function reverse(head, tail) {
    let prev = null;
    let cur = head;
    while (cur !== tail) {
      const next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }
    return prev;
  }
  const dummy = { val: 0, next: head };
  let prevGroup = dummy;
  while (true) {
    // 第一步:从 prevGroup 后探测 k 个结点,找到这组的尾后结点
    let tail = prevGroup;
    for (let i = 0; i < k; i++) {
      tail = tail.next;
      if (!tail) return dummy.next; // 不足 k 个,结束
    }
    const groupHead = prevGroup.next;
    const nextGroup = tail.next;
    // 第三步:翻转这一组,并把首尾接回链表
    reverse(groupHead, nextGroup);
    prevGroup.next = tail; // 原尾变新头
    groupHead.next = nextGroup; // 原头变新尾,接下一组
    prevGroup = groupHead;
  }
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 31 下一个排列

`A 档` · 频度 136

从右找第一个升序对,交换后翻转尾部,得到字典序下一个排列。

**思路**:从右往左找第一个 `nums[i] < nums[i+1]` 的位置 i（升序断点）。再从右找第一个比 nums[i] 大的数交换,最后把 i 之后的降序段翻转成升序,使增幅最小。

```js
function nextPermutation(nums) {
  const n = nums.length;
  // 第一步:从右找第一个 nums[i] < nums[i+1] 的下降点 i
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  // 第二步:若存在 i,从右找第一个比 nums[i] 大的数 j,交换
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  // 第三步:翻转 i 之后的降序段,使其变升序(最小增幅)
  let left = i + 1;
  let right = n - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 32 最长有效括号

`A 档` · 频度 148 · hard

栈存下标,栈底垫一个 -1 作为基准,用下标差算有效长度。

**思路**:栈里存「未匹配位置」的下标,初始放 -1 当哨兵。遇 `(` 压下标;遇 `)` 弹栈,若弹空说明这是个无法匹配的右括号,把它的下标压进去当新基准,否则用当前下标减栈顶得到有效长度。

```js
function longestValidParentheses(s) {
  let max = 0;
  // 第一步:栈底放 -1 当哨兵,方便算长度
  const stack = [-1];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      // 第二步:左括号压下标
      stack.push(i);
    } else {
      // 第三步:右括号先弹栈
      stack.pop();
      if (stack.length === 0) {
        stack.push(i); // 弹空了,当前右括号成新基准
      } else {
        max = Math.max(max, i - stack[stack.length - 1]);
      }
    }
  }
  return max;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 33 搜索旋转排序数组

`S 档` · 频度 309

二分:每次判断哪半是有序的,再看 target 是否落在有序半内。

**思路**:旋转数组从中间切开,至少有一半是有序的。先判断 mid 落在哪个有序半,再看 target 在不在这个有序区间内,据此决定往哪边收缩。

```js
function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    // 第一步:判断左半 [lo, mid] 是否有序
    if (nums[lo] <= nums[mid]) {
      // 第二步:target 在有序的左半区间内就收左,否则收右
      if (nums[lo] <= target && target < nums[mid]) {
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    } else {
      // 第三步:右半 [mid, hi] 有序,同理判断
      if (nums[mid] < target && target <= nums[hi]) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
  }
  return -1;
}
```

**复杂度**:时间 O(log n),空间 O(1)。

### 34 在排序数组中查找元素的第一个和最后一个位置

`A 档` · 频度 102

两次二分,分别找左边界和右边界。

**思路**:用一个「找第一个 ≥ target 的下标」的二分函数。左边界 = 该函数对 target 的结果;右边界 = 该函数对 target+1 的结果减 1。

```js
function searchRange(nums, target) {
  // 第二步:找第一个 >= x 的下标(下界二分)
  function lowerBound(x) {
    let lo = 0;
    let hi = nums.length; // 注意右开,可越界返回 length
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] < x) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }
  // 第一步:左边界是 lowerBound(target)
  const left = lowerBound(target);
  // 若越界或不等于 target,说明不存在
  if (left === nums.length || nums[left] !== target) return [-1, -1];
  // 第三步:右边界 = 第一个 > target 的下标 - 1
  const right = lowerBound(target + 1) - 1;
  return [left, right];
}
```

**复杂度**:时间 O(log n),空间 O(1)。

### 39 组合总和

`A 档` · 频度 96

回溯:每个数可重复选,通过限定起始下标避免重复组合。

**思路**:DFS 累加,从当前下标 start 开始选（允许重复用同一个数,所以下钻时仍传 i,不传 i+1）。和等于 target 收集,超过则剪枝回溯。

```js
function combinationSum(candidates, target) {
  const res = [];
  // 第一步:回溯,start 限制从哪个下标开始选,避免重复组合
  function backtrack(start, remain, path) {
    // 第二步:剩余为 0 收集答案
    if (remain === 0) {
      res.push([...path]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remain) continue; // 剪枝:超了跳过
      path.push(candidates[i]);
      // 第三步:可重复选同一个数,所以仍传 i
      backtrack(i, remain - candidates[i], path);
      path.pop(); // 撤销选择
    }
  }
  backtrack(0, target, []);
  return res;
}
```

**复杂度**:时间 O(S)（S 为所有可行解的总长度,指数级）,空间 O(target)（递归深度）。

### 41 缺失的第一个正数

`A 档` · 频度 113 · hard

原地哈希:把数字 x 放到下标 x-1 的位置,再找第一个不匹配的位置。

**思路**:答案一定在 `[1, n+1]` 范围内。把每个在范围内的数 x 交换到它该在的位置 `nums[x-1]`,再扫一遍,第一个 `nums[i] !== i+1` 的位置就是缺失值。

```js
function firstMissingPositive(nums) {
  const n = nums.length;
  // 第一步:把每个 x∈[1,n] 归位到下标 x-1
  for (let i = 0; i < n; i++) {
    // 用 while 反复交换,直到当前位置放不下合法数
    while (
      nums[i] > 0 &&
      nums[i] <= n &&
      nums[nums[i] - 1] !== nums[i] // 目标位上不是同一个数,才交换(防死循环)
    ) {
      const target = nums[i] - 1;
      [nums[i], nums[target]] = [nums[target], nums[i]];
    }
  }
  // 第二步:找第一个不在位的下标
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  // 第三步:全部归位,缺失的是 n+1
  return n + 1;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 42 接雨水

`S 档` · 频度 197 · hard

双指针:每个位置能接的水由两侧最大高度的较小值决定。

**思路**:左右指针向中间走,各自维护已见过的最大高度 leftMax、rightMax。哪边的 max 小就处理哪边——因为该侧水位由较小的 max 封顶,可直接结算这一格的水。

```js
function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  // 第一步:双指针向中间收缩
  while (left < right) {
    // 第二步:处理较矮的一侧(其水位被这一侧的 max 封顶,可确定)
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 46 全排列

`S 档` · 频度 296

回溯:用 used 数组标记已用元素,逐位填入未用过的数。

**思路**:DFS 逐位选数,used 记录哪些用过。path 满了就是一个排列。每选一个数就标记、下钻,回来再撤销标记。

```js
function permute(nums) {
  const res = [];
  const used = new Array(nums.length).fill(false);
  // 第一步:回溯,path 是当前已选的排列前缀
  function backtrack(path) {
    // 第二步:选满 n 个就收集
    if (path.length === nums.length) {
      res.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue; // 跳过已用
      // 第三步:选 i,标记 → 下钻 → 撤销
      used[i] = true;
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      used[i] = false;
    }
  }
  backtrack([]);
  return res;
}
```

**复杂度**:时间 O(n × n!),空间 O(n)（递归深度）。

### 48 旋转图像

`A 档` · 频度 83

先沿主对角线转置,再左右翻转每一行,等价于顺时针 90 度。

**思路**:顺时针旋转 = 转置 + 水平镜像。转置交换 `matrix[i][j]` 和 `matrix[j][i]`（只遍历上三角），再把每行反转。全程原地。

```js
function rotate(matrix) {
  const n = matrix.length;
  // 第一步:转置,沿主对角线交换(只遍历上三角避免转回去)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // 第二步:每行左右翻转
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}
```

**复杂度**:时间 O(n²),空间 O(1)。

### 53 最大子数组和

`S 档` · 频度 373

动态规划（Kadane）:每个位置决定「接上前面」还是「另起炉灶」。

**思路**:cur 表示以当前元素结尾的最大子数组和。若前面的和是负的,不如丢掉重新开始。每步更新 cur 并记录全局最大。

```js
function maxSubArray(nums) {
  // 第一步:cur 是以当前元素结尾的最大和,max 是全局答案
  let cur = nums[0];
  let max = nums[0];
  // 第二步:从第二个开始,选择接上或重启
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    max = Math.max(max, cur);
  }
  return max;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 54 螺旋矩阵

`S 档` · 频度 254

维护上下左右四个边界,按右→下→左→上顺序逐圈收缩。

**思路**:用 top、bottom、left、right 框出当前圈。每按一个方向走完就收缩对应边界。注意走左、走上时要判断边界是否还有效（防止单行/单列重复读）。

```js
function spiralOrder(matrix) {
  const res = [];
  // 第一步:四个边界
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    // 第二步:从左到右,走完 top 下移
    for (let j = left; j <= right; j++) res.push(matrix[top][j]);
    top++;
    // 第三步:从上到下,走完 right 左移
    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
    right--;
    // 第四步:从右到左(需判断还有行)
    if (top <= bottom) {
      for (let j = right; j >= left; j--) res.push(matrix[bottom][j]);
      bottom--;
    }
    // 第五步:从下到上(需判断还有列)
    if (left <= right) {
      for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);
      left++;
    }
  }
  return res;
}
```

**复杂度**:时间 O(m × n),空间 O(1)（不算输出）。

### 55 跳跃游戏

`A 档` · 频度 56

判断能否从起点跳到终点,每个位置的值是最大跳跃步数。

**思路**:贪心维护当前能到达的最远下标 `maxReach`,遍历时若当前位置超出了 `maxReach` 说明跳不过去。

```js
function canJump(nums) {
  // 第一步:记录能到达的最远位置
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    // 第二步:当前位置已经超出可达范围,失败
    if (i > maxReach) return false;
    // 第三步:更新最远可达位置
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 56 合并区间

`S 档` · 频度 239

合并所有重叠的区间。

**思路**:先按左端点排序,再依次扫描;若当前区间左端点 `<=` 上一个合并区间的右端点就合并,否则新开一个区间。

```js
function merge(intervals) {
  // 第一步:按区间左端点升序排序
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [];
  for (const [start, end] of intervals) {
    const last = result[result.length - 1];
    // 第二步:与上一个区间重叠则合并(扩展右端点)
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      // 第三步:不重叠则作为新区间加入
      result.push([start, end]);
    }
  }
  return result;
}
```

**复杂度**:时间 O(n log n),空间 O(n)。

### 62 不同路径

`A 档` · 频度 78

机器人从左上角走到右下角,只能向右或向下,求路径总数。

**思路**:`dp[j] = dp[j] + dp[j-1]`,即到达某格的路径数等于上方加左方,用一维数组滚动。

```js
function uniquePaths(m, n) {
  // 第一步:第一行每格都只有一种走法
  const dp = new Array(n).fill(1);
  // 第二步:从第二行开始,每格 = 上方(原 dp[j]) + 左方(dp[j-1])
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] = dp[j] + dp[j - 1];
    }
  }
  return dp[n - 1];
}
```

**复杂度**:时间 O(m·n),空间 O(n)。

### 64 最小路径和

`A 档` · 频度 95

从左上到右下,每次向右或向下,求路径上数字和最小的路径和。

**思路**:`dp[i][j]` 为到该格的最小路径和,等于自身加上(上、左中的较小者)。原地复用 `grid` 节省空间。

```js
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  // 第一步:逐格计算最小路径和
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      // 第二步:第一行只能从左来,第一列只能从上来
      else if (i === 0) grid[i][j] += grid[i][j - 1];
      else if (j === 0) grid[i][j] += grid[i - 1][j];
      // 第三步:其余取上、左的较小者
      else grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
    }
  }
  return grid[m - 1][n - 1];
}
```

**复杂度**:时间 O(m·n),空间 O(1)。

### 70 爬楼梯

`A 档` · 频度 129

每次爬 1 或 2 级,求爬到第 n 级的方法数。

**思路**:`dp[i] = dp[i-1] + dp[i-2]`,本质斐波那契,只需滚动两个变量。

```js
function climbStairs(n) {
  // 第一步:边界,1、2 级直接返回
  if (n <= 2) return n;
  // 第二步:滚动维护前两级的走法数
  let prev = 1, cur = 2;
  for (let i = 3; i <= n; i++) {
    const next = prev + cur;
    prev = cur;
    cur = next;
  }
  return cur;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 72 编辑距离

`S 档` · 频度 200 · hard

求把 `word1` 变成 `word2` 的最少操作数(增、删、改)。

**思路**:`dp[i][j]` 表示 `word1` 前 i 个字符变成 `word2` 前 j 个字符的最少操作。字符相同则继承 `dp[i-1][j-1]`,否则取删、增、改三者最小值加 1。

```js
function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  // 第一步:dp 多开一行一列存空串边界
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  // 第二步:初始化边界,空串到长 j 的串需 j 次插入
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  // 第三步:填表
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // 删 dp[i-1][j]、增 dp[i][j-1]、改 dp[i-1][j-1]
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }
  return dp[m][n];
}
```

**复杂度**:时间 O(m·n),空间 O(m·n)。

### 75 颜色分类

`A 档` · 频度 49

原地把只含 0、1、2 的数组排好序(荷兰国旗问题)。

**思路**:三指针,`zero` 指向 0 区右边界,`two` 指向 2 区左边界,`i` 扫描;遇 0 换到前面,遇 2 换到后面。

```js
function sortColors(nums) {
  // 第一步:zero 是下一个 0 该放的位置,two 是下一个 2 该放的位置
  let zero = 0, two = nums.length - 1, i = 0;
  while (i <= two) {
    if (nums[i] === 0) {
      // 第二步:遇 0,与 zero 交换,两指针都前进
      [nums[i], nums[zero]] = [nums[zero], nums[i]];
      zero++;
      i++;
    } else if (nums[i] === 2) {
      // 第三步:遇 2,与 two 交换,i 不动(换来的值还需判断)
      [nums[i], nums[two]] = [nums[two], nums[i]];
      two--;
    } else {
      i++;
    }
  }
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 76 最小覆盖子串

`A 档` · 频度 133 · hard

在 `s` 中找出含 `t` 所有字符(含重复)的最短子串。

**思路**:滑动窗口 + 计数。`need` 记录 t 中各字符所需数量,`valid` 记录窗口内已满足的字符种类数;右扩到满足后左缩取最短。

```js
function minWindow(s, t) {
  // 第一步:统计 t 中每个字符需要的数量
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);

  const window = new Map();
  let left = 0, valid = 0;
  let start = 0, len = Infinity;

  for (let right = 0; right < s.length; right++) {
    // 第二步:右指针扩窗,更新窗口计数
    const c = s[right];
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) valid++;
    }
    // 第三步:窗口已覆盖全部所需字符,尝试左缩取最短
    while (valid === need.size) {
      if (right - left + 1 < len) {
        start = left;
        len = right - left + 1;
      }
      const d = s[left];
      left++;
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) valid--;
        window.set(d, window.get(d) - 1);
      }
    }
  }
  return len === Infinity ? '' : s.substr(start, len);
}
```

**复杂度**:时间 O(|s| + |t|),空间 O(字符集大小)。

### 78 子集

`A 档` · 频度 105

返回数组所有不重复元素的全部子集(幂集)。

**思路**:回溯,每个元素「选或不选」;以当前下标 `start` 为起点向后扩展,每进入一层就记录一个子集。

```js
function subsets(nums) {
  const result = [];
  const path = [];
  // 第一步:从 start 开始向后选,避免重复组合
  function backtrack(start) {
    // 第二步:每个节点都是一个合法子集
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);       // 选 nums[i]
      backtrack(i + 1);         // 继续向后
      path.pop();               // 撤销,尝试不选
    }
  }
  backtrack(0);
  return result;
}
```

**复杂度**:时间 O(n·2ⁿ),空间 O(n)(递归栈)。

### 79 单词搜索

`A 档` · 频度 61

判断网格中能否按上下左右相邻连成给定单词(同格不可重复用)。

**思路**:从每个格子起 DFS,匹配成功就向四个方向递归;用临时改写当前格为占位符做「访问标记」,回溯时还原。

```js
function exist(board, word) {
  const m = board.length, n = board[0].length;

  function dfs(i, j, k) {
    // 第一步:越界或字符不匹配则失败
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
    // 第二步:匹配到最后一个字符,成功
    if (k === word.length - 1) return true;
    // 第三步:标记已访问,向四方向探索
    const tmp = board[i][j];
    board[i][j] = '#';
    const found =
      dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) ||
      dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1);
    // 第四步:回溯还原
    board[i][j] = tmp;
    return found;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
}
```

**复杂度**:时间 O(m·n·3ᴸ)(L 为单词长度),空间 O(L)。

### 94 二叉树的中序遍历

`A 档` · 频度 144

返回二叉树中序遍历(左-根-右)的节点值数组。

**思路**:用栈模拟递归。先把左链全部压栈,弹出即访问,再转向右子树。

```js
function inorderTraversal(root) {
  const result = [];
  const stack = [];
  let cur = root;
  // 第一步:只要还有节点或栈非空就继续
  while (cur || stack.length) {
    // 第二步:沿左子树一路压栈
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    // 第三步:弹出访问,再转向其右子树
    cur = stack.pop();
    result.push(cur.val);
    cur = cur.right;
  }
  return result;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 98 验证二叉搜索树

`A 档` · 频度 84

判断一棵二叉树是否为合法 BST(左子树全小、右子树全大)。

**思路**:中序遍历 BST 得到的序列严格递增。遍历时记录前驱节点值,一旦不严格递增就非法。

```js
function isValidBST(root) {
  let prev = -Infinity;

  function inorder(node) {
    if (!node) return true;
    // 第一步:先递归左子树
    if (!inorder(node.left)) return false;
    // 第二步:当前值必须严格大于前驱
    if (node.val <= prev) return false;
    prev = node.val;
    // 第三步:再递归右子树
    return inorder(node.right);
  }

  return inorder(root);
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 101 对称二叉树

`A 档` · 频度 96

判断二叉树是否轴对称(左右镜像)。

**思路**:递归比较两棵子树是否镜像——左的左对右的右,左的右对右的左。

```js
function isSymmetric(root) {
  // 第一步:两子树都空为对称,一空一非空不对称
  function isMirror(left, right) {
    if (!left && !right) return true;
    if (!left || !right) return false;
    // 第二步:根值相等,且外侧、内侧分别镜像
    return (
      left.val === right.val &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left)
    );
  }
  return isMirror(root?.left, root?.right);
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 102 二叉树的层序遍历

`S 档` · 频度 328

返回二叉树逐层从左到右的节点值,每层一个数组。

**思路**:BFS,用队列。每轮先记录当前队列长度作为「本层节点数」,只处理这么多个,即可按层切分。

```js
function levelOrder(root) {
  const result = [];
  if (!root) return result;
  const queue = [root];
  while (queue.length) {
    // 第一步:本层节点数 = 当前队列长度
    const size = queue.length;
    const level = [];
    // 第二步:只处理本层这 size 个,孩子入队留给下一轮
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 104 二叉树的最大深度

`A 档` · 频度 91

返回二叉树的最大深度(根到最远叶子的层数)。

**思路**:递归,深度 = 左右子树深度的较大者加 1。

```js
function maxDepth(root) {
  // 第一步:空节点深度为 0
  if (!root) return 0;
  // 第二步:取左右子树较深者 + 1
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 105 从前序与中序遍历序列构造二叉树

`A 档` · 频度 114

由前序和中序遍历结果重建二叉树。

**思路**:前序第一个是根;在中序里定位根,左边是左子树、右边是右子树,递归构造。用哈希表 O(1) 查中序位置。

```js
function buildTree(preorder, inorder) {
  // 第一步:记录每个值在中序中的下标,便于切分左右子树
  const indexMap = new Map();
  inorder.forEach((val, i) => indexMap.set(val, i));

  let preIdx = 0;
  // 第二步:在中序区间 [inLeft, inRight] 内构造子树
  function build(inLeft, inRight) {
    if (inLeft > inRight) return null;
    // 第三步:前序当前值为根,在中序中找其位置
    const rootVal = preorder[preIdx++];
    const root = { val: rootVal, left: null, right: null };
    const mid = indexMap.get(rootVal);
    // 第四步:先构左子树(前序紧跟根),再构右子树
    root.left = build(inLeft, mid - 1);
    root.right = build(mid + 1, inRight);
    return root;
  }

  return build(0, inorder.length - 1);
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 121 买卖股票的最佳时机

`S 档` · 频度 278

只能买卖一次,求最大利润。

**思路**:一次遍历,维护「迄今最低价」,用当前价减最低价更新最大利润。

```js
function maxProfit(prices) {
  // 第一步:记录历史最低买入价和最大利润
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const price of prices) {
    // 第二步:刷新最低买入价
    if (price < minPrice) minPrice = price;
    // 第三步:用今天卖出的利润更新答案
    else if (price - minPrice > maxProfit) maxProfit = price - minPrice;
  }
  return maxProfit;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 124 二叉树中的最大路径和

`A 档` · 频度 183 · hard

路径可从任意节点到任意节点(不必过根),求路径节点值之和的最大值。

**思路**:后序递归。每个节点算出「向下延伸的最大贡献」(只能选左或右一条);同时用「左贡献 + 右贡献 + 自身」更新全局答案。负贡献用 0 截断。

```js
function maxPathSum(root) {
  let maxSum = -Infinity;

  // 第一步:返回从 node 向下延伸的最大单边贡献
  function gain(node) {
    if (!node) return 0;
    // 第二步:左右贡献若为负则舍弃(取 0)
    const leftGain = Math.max(gain(node.left), 0);
    const rightGain = Math.max(gain(node.right), 0);
    // 第三步:以 node 为「拐点」的路径和,更新全局最大
    maxSum = Math.max(maxSum, node.val + leftGain + rightGain);
    // 第四步:向上只能传一条边
    return node.val + Math.max(leftGain, rightGain);
  }

  gain(root);
  return maxSum;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 128 最长连续序列

`A 档` · 频度 92

无序数组中找最长连续元素序列的长度,要求 O(n)。

**思路**:全部入 `Set`。只从「序列起点」(即 `num-1` 不在集合中)开始向上数,保证每个数只被遍历一次。

```js
function longestConsecutive(nums) {
  const set = new Set(nums);
  let longest = 0;
  for (const num of set) {
    // 第一步:只有 num 是连续段起点时才开始计数
    if (!set.has(num - 1)) {
      let cur = num;
      let length = 1;
      // 第二步:不断向上找连续的下一个数
      while (set.has(cur + 1)) {
        cur++;
        length++;
      }
      // 第三步:更新最长长度
      longest = Math.max(longest, length);
    }
  }
  return longest;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 136 只出现一次的数字

`A 档` · 频度 53

数组中每个数出现两次,只有一个出现一次,找出它。

**思路**:异或。相同数异或为 0,任何数异或 0 不变,全员异或后剩下的就是答案。

```js
function singleNumber(nums) {
  // 第一步:从 0 开始,逐个异或
  let result = 0;
  for (const num of nums) {
    // 第二步:成对的数互相抵消,只剩单独那个
    result ^= num;
  }
  return result;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 138 随机链表的复制

`A 档` · 频度 58

深拷贝带 `random` 指针的链表。

**思路**:用哈希表建立「原节点 → 新节点」映射。第一遍只建新节点,第二遍照原图接好 `next` 和 `random` 指针。

```js
function copyRandomList(head) {
  if (!head) return null;
  // 第一步:遍历原链表,为每个原节点创建对应新节点存入 Map
  const map = new Map();
  let cur = head;
  while (cur) {
    map.set(cur, { val: cur.val, next: null, random: null });
    cur = cur.next;
  }
  // 第二步:再遍历,借助 Map 连好新节点的 next 和 random
  cur = head;
  while (cur) {
    const copy = map.get(cur);
    copy.next = cur.next ? map.get(cur.next) : null;
    copy.random = cur.random ? map.get(cur.random) : null;
    cur = cur.next;
  }
  return map.get(head);
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 139 单词拆分

`A 档` · 频度 69

判断 `s` 能否被空格拆成字典中的单词序列(可重复用)。

**思路**:`dp[i]` 表示 `s` 前 i 个字符能否被拆分。若 `dp[j]` 为真且 `s[j..i)` 在字典中,则 `dp[i]` 为真。

```js
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const n = s.length;
  // 第一步:dp[i] 表示前 i 个字符可拆分;空串可拆
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  // 第二步:枚举结尾 i,再枚举切点 j
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      // 第三步:前 j 可拆 且 s[j..i) 是单词,则前 i 可拆
      if (dp[j] && wordSet.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n];
}
```

**复杂度**:时间 O(n²)(切片视为常数近似),空间 O(n)。

### 141 环形链表

`S 档` · 频度 250

判断链表中是否有环。

**思路**:快慢指针。快指针每次走两步、慢指针一步,有环则必然相遇。

```js
function hasCycle(head) {
  // 第一步:快慢指针都从头出发
  let slow = head, fast = head;
  while (fast && fast.next) {
    // 第二步:慢走一步,快走两步
    slow = slow.next;
    fast = fast.next.next;
    // 第三步:相遇说明有环
    if (slow === fast) return true;
  }
  return false;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 142 环形链表 II

`A 档` · 频度 170

返回链表开始入环的第一个节点,无环返回 null。

**思路**:快慢指针相遇后,把一个指针重置到头,两指针都每次走一步,再次相遇处即环入口(基于「头到入口距离 = 相遇点绕环到入口距离」的数学推导)。

```js
function detectCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    // 第一步:快慢相遇,确认有环
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      // 第二步:一指针回到头,两指针同速前进
      let ptr = head;
      while (ptr !== slow) {
        ptr = ptr.next;
        slow = slow.next;
      }
      // 第三步:再次相遇点就是环入口
      return ptr;
    }
  }
  return null;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 146 LRU 缓存

`S 档` · 频度 929

设计支持 O(1) 的 `get` 和 `put` 的最近最少使用缓存。

**思路**:哈希表 + 双向链表。哈希表 O(1) 定位节点;双向链表头部放最近使用、尾部放最久未用,容量满时删尾部。用伪头尾哨兵节点简化边界。

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    // 第一步:建立伪头尾哨兵,head.next 为最近使用,tail.prev 为最久未用
    this.head = { key: 0, val: 0, prev: null, next: null };
    this.tail = { key: 0, val: 0, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 工具:从链表中摘除一个节点
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // 工具:把节点插到头部(最近使用)
  _addToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    // 第二步:命中则移到头部表示最近使用
    const node = this.map.get(key);
    this._remove(node);
    this._addToHead(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      // 第三步:已存在则更新值并移到头部
      const node = this.map.get(key);
      node.val = value;
      this._remove(node);
      this._addToHead(node);
    } else {
      // 第四步:新增节点;超容量则淘汰尾部(最久未用)
      if (this.map.size >= this.capacity) {
        const lru = this.tail.prev;
        this._remove(lru);
        this.map.delete(lru.key);
      }
      const node = { key, val: value, prev: null, next: null };
      this._addToHead(node);
      this.map.set(key, node);
    }
  }
}
```

**复杂度**:`get` 和 `put` 均为 O(1),空间 O(capacity)。

### 148 排序链表

`A 档` · 频度 147

链表的归并排序:快慢指针找中点,断成两半,递归排序后合并。

**思路**:数组排序的最优解是 `O(n log n)`,链表也一样用归并。快慢指针找中点切断,递归排到不能再分,再两两合并有序链表。

```js
function sortList(head) {
  // 第一步:边界,0 或 1 个节点直接返回
  if (!head || !head.next) return head;

  // 第二步:快慢指针找中点,slow 停在前半段的末尾
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // 第三步:断开成两半
  const mid = slow.next;
  slow.next = null;

  // 第四步:递归排序两半
  const left = sortList(head);
  const right = sortList(mid);

  // 第五步:合并两个有序链表
  return merge(left, right);
}

function merge(a, b) {
  const dummy = { next: null };
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b; // 接上剩余部分
  return dummy.next;
}
```

**复杂度**:时间 O(n log n),空间 O(log n)(递归栈)。

### 152 乘积最大子数组

`A 档` · 频度 85

同时维护以当前位置结尾的最大值和最小值,因为负数会让最大最小互换。

**思路**:乘积有负负得正的陷阱,所以要同时记 `max` 和 `min`。遇到负数时,之前的最小值乘上去反而可能变最大,所以每步先把 max/min 交换再更新。

```js
function maxProduct(nums) {
  // 第一步:以第一个数初始化结果、当前最大、当前最小
  let result = nums[0];
  let curMax = nums[0];
  let curMin = nums[0];

  // 第二步:从第二个数开始遍历
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    // 负数会让最大最小互换,先交换
    if (n < 0) {
      [curMax, curMin] = [curMin, curMax];
    }
    // 要么接着前面乘,要么从自己重新开始
    curMax = Math.max(n, curMax * n);
    curMin = Math.min(n, curMin * n);
    // 更新全局最大
    result = Math.max(result, curMax);
  }
  return result;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 153 寻找旋转排序数组中的最小值

`A 档` · 频度 58

二分:最小值在「乱掉」的那一半里,和右端点比较判断。

**思路**:旋转后数组分两段升序。拿 `mid` 和右端点 `right` 比:若 `nums[mid] > nums[right]`,最小值一定在右半段;否则在左半段(含 mid)。

```js
function findMin(nums) {
  // 第一步:左右指针
  let left = 0;
  let right = nums.length - 1;

  // 第二步:二分,直到 left === right 锁定最小值
  while (left < right) {
    const mid = (left + right) >> 1;
    if (nums[mid] > nums[right]) {
      // mid 在左段(较大的那段),最小值在右边
      left = mid + 1;
    } else {
      // mid 可能就是最小值,不能跳过它
      right = mid;
    }
  }
  return nums[left];
}
```

**复杂度**:时间 O(log n),空间 O(1)。

### 155 最小栈

`A 档` · 频度 99

辅助栈同步记录「到当前为止的最小值」,push 时存当前最小,pop 时同步弹出。

**思路**:要 `O(1)` 拿最小值,用一个 `minStack` 跟主栈同步进出,每次 push 存 `min(新值, 当前栈顶最小)`,这样栈顶永远是当前最小。

```js
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = []; // 与 stack 同步,栈顶永远是当前最小值
  }

  push(val) {
    this.stack.push(val);
    // 第一步:新的最小值 = 新值 与 当前最小 取较小
    const curMin = this.minStack.length
      ? Math.min(val, this.getMin())
      : val;
    this.minStack.push(curMin);
  }

  pop() {
    this.stack.pop();
    this.minStack.pop(); // 同步弹出
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}
```

**复杂度**:每个操作时间 O(1),空间 O(n)。

### 160 相交链表

`S 档` · 频度 201

两个指针各走完自己再走对方,走过的总长度相同,会在交点相遇。

**思路**:经典「双指针换轨」。a 走完链表 A 接着走 B,b 走完 B 接着走 A,两者走的总步数都是 `lenA + lenB`,若相交则同时到达交点,否则同时到 null。

```js
function getIntersectionNode(headA, headB) {
  // 第一步:两个指针分别从两个头出发
  let a = headA;
  let b = headB;

  // 第二步:谁先到尾就换到另一条链表头
  while (a !== b) {
    a = a ? a.next : headB; // a 走完 A 转去 B
    b = b ? b.next : headA; // b 走完 B 转去 A
  }
  // 相遇点即交点,无交点则都为 null
  return a;
}
```

**复杂度**:时间 O(m + n),空间 O(1)。

### 169 多数元素

`A 档` · 频度 68

摩尔投票:候选值和计数,不同就抵消,相同就加一,留到最后的就是多数。

**思路**:多数元素出现次数超过一半,用「同归于尽」抵消法:维护一个候选和票数,遇到相同 +1,不同 -1,票数归零就换候选。它出现太多,抵消不完。

```js
function majorityElement(nums) {
  // 第一步:候选和票数
  let candidate = nums[0];
  let count = 0;

  // 第二步:遍历投票
  for (const n of nums) {
    if (count === 0) {
      candidate = n; // 票数归零,换新候选
    }
    count += n === candidate ? 1 : -1;
  }
  return candidate;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 198 打家劫舍

`A 档` · 频度 73

不能偷相邻两家。每家选「偷(隔一家)」或「不偷(接上一家)」取较大。

**思路**:DP。到第 `i` 家的最大金额 = `max(偷它 + 前前家, 不偷它 = 前一家)`。只依赖前两个状态,用两个变量滚动即可。

```js
function rob(nums) {
  // 第一步:prev2 表示前前家的最优,prev1 表示前一家的最优
  let prev2 = 0;
  let prev1 = 0;

  // 第二步:逐家决策
  for (const money of nums) {
    // 偷这家(prev2 + money)还是不偷(prev1)
    const cur = Math.max(prev1, prev2 + money);
    prev2 = prev1; // 滚动前移
    prev1 = cur;
  }
  return prev1;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 199 二叉树的右视图

`A 档` · 频度 161

层序遍历,每层最后一个节点就是右视图能看到的。

**思路**:BFS 按层遍历,每层记录最后一个出队的节点值,就是从右往左看到的那个。

```js
function rightSideView(root) {
  const result = [];
  if (!root) return result;

  // 第一步:队列做层序遍历
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    // 第二步:遍历这一层,记下最后一个节点
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      if (i === size - 1) {
        result.push(node.val); // 本层最右
      }
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return result;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 200 岛屿数量

`S 档` · 频度 327

遍历网格,遇到陆地就计数加一,并用 DFS 把整片岛「淹掉」(置 0),避免重复。

**思路**:扫描每个格子,碰到 `'1'` 说明发现新岛,结果 +1,然后 DFS 向四周扩散把这片连通陆地全标记为 `'0'`,防止下次再数到。

```js
function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  // 第一步:DFS 把相连陆地全淹掉
  function dfs(r, c) {
    // 越界或是水,停止
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') {
      return;
    }
    grid[r][c] = '0'; // 淹掉当前格
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  // 第二步:扫描整个网格
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c); // 淹掉这一整片
      }
    }
  }
  return count;
}
```

**复杂度**:时间 O(m × n),空间 O(m × n)(递归栈最坏)。

### 206 反转链表

`S 档` · 频度 744

三个指针 prev/cur/next,逐个把箭头掉头。

**思路**:遍历链表,每步把当前节点的 `next` 指回前驱,再整体前移。

```js
function reverseList(head) {
  // 第一步:prev 起初为 null(反转后它是新尾巴的下一个)
  let prev = null;
  let cur = head;
  // 第二步:逐个掉头
  while (cur) {
    const next = cur.next; // 先存下一个,别丢了
    cur.next = prev;       // 掉头
    prev = cur;            // prev、cur 一起前移
    cur = next;
  }
  return prev; // prev 最终指向原链表尾,即新头
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 207 课程表

`A 档` · 频度 66

拓扑排序(BFS):算每门课的入度,从入度为 0 的课开始消,能消完所有课就无环。

**思路**:判断有向图是否有环。建邻接表 + 入度数组,把入度 0 的课入队,出队一门就把它指向的课入度减一,减到 0 再入队。最后消课数等于总数则可行。

```js
function canFinish(numCourses, prerequisites) {
  // 第一步:建邻接表和入度数组
  const graph = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course); // 先修 pre 才能学 course
    inDegree[course]++;
  }

  // 第二步:入度为 0 的课先入队
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  // 第三步:逐个消课
  let finished = 0;
  while (queue.length) {
    const course = queue.shift();
    finished++;
    for (const next of graph[course]) {
      inDegree[next]--; // 解锁后继
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  // 全部消完说明无环
  return finished === numCourses;
}
```

**复杂度**:时间 O(V + E),空间 O(V + E)。

### 215 数组中的第 K 个最大元素

`S 档` · 频度 597

快速选择:借快排的 partition,每轮把基准放到最终位置,只递归 k 所在的那一半。

**思路**:第 k 大即排序后下标 `n-k`。快排每次 partition 能确定一个元素的最终位置,只要它落在目标下标就找到了,否则只往一侧递归,平均 `O(n)`。

```js
function findKthLargest(nums, k) {
  const target = nums.length - k; // 第 k 大在升序中的下标

  // 第一步:partition,返回基准的最终下标
  function partition(left, right) {
    const pivot = nums[right]; // 用最右作基准
    let i = left;
    for (let j = left; j < right; j++) {
      if (nums[j] < pivot) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
      }
    }
    [nums[i], nums[right]] = [nums[right], nums[i]];
    return i;
  }

  // 第二步:快速选择,只递归目标所在的一侧
  let left = 0;
  let right = nums.length - 1;
  while (true) {
    const p = partition(left, right);
    if (p === target) return nums[p];
    if (p < target) left = p + 1;
    else right = p - 1;
  }
}
```

**复杂度**:平均时间 O(n),最坏 O(n²);空间 O(1)。

### 226 翻转二叉树

`A 档` · 频度 68

递归交换每个节点的左右子树。

**思路**:对每个节点,先递归翻转左右子树,再交换它俩。自底向上或自顶向下都行。

```js
function invertTree(root) {
  // 第一步:空节点直接返回
  if (!root) return null;

  // 第二步:递归翻转左右子树
  const left = invertTree(root.left);
  const right = invertTree(root.right);

  // 第三步:交换
  root.left = right;
  root.right = left;
  return root;
}
```

**复杂度**:时间 O(n),空间 O(h)(递归栈,h 为树高)。

### 234 回文链表

`A 档` · 频度 86

快慢指针找中点,反转后半段,再从两头向中间逐一比对。

**思路**:链表不能随机访问,所以先用快慢指针定位中点,把后半段原地反转,然后前半段和反转后的后半段同步比较。

```js
function isPalindrome(head) {
  // 第一步:快慢指针找中点,slow 落在后半段起点
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 第二步:反转后半段
  let prev = null;
  while (slow) {
    const next = slow.next;
    slow.next = prev;
    prev = slow;
    slow = next;
  }

  // 第三步:前半段与反转后的后半段逐一比对
  let left = head;
  let right = prev;
  while (right) {
    if (left.val !== right.val) return false;
    left = left.next;
    right = right.next;
  }
  return true;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 236 二叉树的最近公共祖先

`S 档` · 频度 265

递归:在左右子树里找 p、q,若分别在两侧,当前节点就是答案。

**思路**:后序递归。若当前节点是 p 或 q 直接返回它;否则递归左右,左右都找到说明 p、q 分居两侧,当前节点即最近公共祖先;只一侧找到就把那侧结果往上传。

```js
function lowestCommonAncestor(root, p, q) {
  // 第一步:递归出口,空节点或命中 p/q 就返回当前
  if (!root || root === p || root === q) {
    return root;
  }

  // 第二步:在左右子树里找
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // 第三步:左右都找到,说明分居两侧,当前就是 LCA
  if (left && right) return root;
  // 否则把非空的那侧往上返回
  return left || right;
}
```

**复杂度**:时间 O(n),空间 O(h)。

### 239 滑动窗口最大值

`A 档` · 频度 152 · hard

单调递减双端队列,队头永远是当前窗口最大值。

**思路**:用双端队列存下标,保持队列对应的值单调递减。新元素入队前把队尾比它小的全弹掉(它们不可能再当最大),队头若滑出窗口也弹掉,队头即窗口最大。

```js
function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = []; // 存下标,对应值单调递减

  for (let i = 0; i < nums.length; i++) {
    // 第一步:队尾比当前小的都弹掉(它们没用了)
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    deque.push(i);

    // 第二步:队头滑出窗口就移除
    if (deque[0] <= i - k) {
      deque.shift();
    }

    // 第三步:窗口形成后,队头即最大值
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}
```

**复杂度**:时间 O(n),空间 O(k)。

### 240 搜索二维矩阵 II

`A 档` · 频度 84

从右上角出发:大了往左,小了往下,每步排除一行或一列。

**思路**:矩阵每行每列都升序。从右上角看,它是所在行最大、所在列最小,比目标大就排掉这一列(左移),比目标小就排掉这一行(下移)。

```js
function searchMatrix(matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // 第一步:从右上角出发
  let r = 0;
  let c = cols - 1;

  // 第二步:每步排除一行或一列
  while (r < rows && c >= 0) {
    const val = matrix[r][c];
    if (val === target) return true;
    if (val > target) {
      c--; // 太大,排除这一列
    } else {
      r++; // 太小,排除这一行
    }
  }
  return false;
}
```

**复杂度**:时间 O(m + n),空间 O(1)。

### 283 移动零

`A 档` · 频度 67

双指针:一个指针记录非零该放的位置,遍历把非零依次前移,末尾补零。

**思路**:`slow` 指向下一个非零应放的位置,`fast` 扫描数组,遇到非零就交换到 `slow` 处并前移,保持非零相对顺序,零自然被挤到末尾。

```js
function moveZeroes(nums) {
  // 第一步:slow 指向下一个非零要放的位置
  let slow = 0;

  // 第二步:fast 遍历,遇非零就换到前面
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
  return nums;
}
```

**复杂度**:时间 O(n),空间 O(1)。

### 300 最长递增子序列

`S 档` · 频度 267

维护一个「最小末尾」数组,二分找位置替换,数组长度即答案。

**思路**:贪心 + 二分。`tails[i]` 存长度为 `i+1` 的递增子序列的最小末尾。对每个数,二分找到第一个 `>=` 它的位置替换(让末尾尽量小),找不到就追加,`tails` 长度即 LIS 长度。

```js
function lengthOfLIS(nums) {
  // tails[i]:长度为 i+1 的递增子序列的最小末尾值
  const tails = [];

  for (const n of nums) {
    // 第一步:二分找第一个 >= n 的位置
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (tails[mid] < n) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    // 第二步:能接到末尾就追加,否则替换该位置
    if (left === tails.length) {
      tails.push(n);
    } else {
      tails[left] = n;
    }
  }
  return tails.length;
}
```

**复杂度**:时间 O(n log n),空间 O(n)。

### 322 零钱兑换

`A 档` · 频度 132

完全背包 DP:`dp[i]` 表示凑出金额 i 所需最少硬币数。

**思路**:`dp[i] = min(dp[i - coin] + 1)` 遍历每种面额。初始化为「不可能」的大值,凑不出返回 -1。

```js
function coinChange(coins, amount) {
  // 第一步:dp[i] 表示凑出 i 的最少硬币数,初始化为不可达
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // 凑 0 元需要 0 枚

  // 第二步:对每个金额尝试每种硬币
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  // 第三步:仍是 Infinity 说明凑不出
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

**复杂度**:时间 O(amount × coins),空间 O(amount)。

### 394 字符串解码

`A 档` · 频度 100

两个栈分别存数字和已拼好的字符串,遇 `]` 时弹出重复拼接。

**思路**:遇数字累计倍数,遇 `[` 把当前字符串和倍数压栈并清空,遇 `]` 弹出栈顶字符串和倍数,把当前串重复后拼回去。

```js
function decodeString(s) {
  // 第一步:数字栈和字符串栈
  const numStack = [];
  const strStack = [];
  let cur = '';
  let num = 0;

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      // 第二步:累计多位数字
      num = num * 10 + Number(ch);
    } else if (ch === '[') {
      // 第三步:遇 [ 把当前状态压栈,重置
      numStack.push(num);
      strStack.push(cur);
      num = 0;
      cur = '';
    } else if (ch === ']') {
      // 第四步:遇 ] 弹出重复拼接
      const repeat = numStack.pop();
      const prev = strStack.pop();
      cur = prev + cur.repeat(repeat);
    } else {
      cur += ch; // 普通字母直接累加
    }
  }
  return cur;
}
```

**复杂度**:时间 O(n)(n 为输出长度),空间 O(n)。

### 543 二叉树的直径

`A 档` · 频度 81

任意两节点最长路径 = 某节点左深 + 右深的最大值,递归求深度时顺手更新。

**思路**:直径未必过根。递归算每个节点的高度,在递归中用「左子树高 + 右子树高」更新全局最大直径(边数),返回值仍是高度。

```js
function diameterOfBinaryTree(root) {
  let maxDiameter = 0;

  // 第一步:递归返回节点高度,顺便更新直径
  function depth(node) {
    if (!node) return 0;
    const left = depth(node.left);
    const right = depth(node.right);
    // 经过当前节点的路径长度 = 左高 + 右高
    maxDiameter = Math.max(maxDiameter, left + right);
    // 返回以当前节点为根的高度
    return Math.max(left, right) + 1;
  }

  depth(root);
  return maxDiameter;
}
```

**复杂度**:时间 O(n),空间 O(h)。

### 560 和为 K 的子数组

`A 档` · 频度 78

前缀和 + 哈希表:查「当前前缀和 - k」出现过几次,就有几个子数组。

**思路**:子数组和 = 两前缀和之差。遍历时若 `prefix - k` 在哈希里出现过,说明存在以当前位置结尾、和为 k 的子数组。哈希记录每个前缀和出现次数。

```js
function subarraySum(nums, k) {
  // 第一步:哈希表记录前缀和出现次数,初始 {0:1} 表示空前缀
  const map = new Map();
  map.set(0, 1);

  let prefix = 0;
  let count = 0;

  // 第二步:遍历累加前缀和
  for (const n of nums) {
    prefix += n;
    // 若存在前缀和为 prefix-k,则它们之间的子数组和为 k
    if (map.has(prefix - k)) {
      count += map.get(prefix - k);
    }
    // 记录当前前缀和
    map.set(prefix, (map.get(prefix) || 0) + 1);
  }
  return count;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 739 每日温度

`A 档` · 频度 62

单调递减栈存下标,遇到更高温度就把栈里比它低的弹出并计算天数差。

**思路**:栈里存「还没等到更暖一天」的下标,温度单调递减。当前温度比栈顶高,说明栈顶等到了答案,弹出并记下标差。

```js
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack = []; // 存下标,对应温度单调递减

  for (let i = 0; i < n; i++) {
    // 第一步:当前温度比栈顶高,栈顶等到了答案
    while (
      stack.length &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const prev = stack.pop();
      result[prev] = i - prev; // 天数差
    }
    // 第二步:当前下标入栈,等待将来更高温
    stack.push(i);
  }
  return result;
}
```

**复杂度**:时间 O(n),空间 O(n)。

### 1143 最长公共子序列

`A 档` · 频度 196

二维 DP:字符相等则左上角 + 1,否则取上方和左方的较大值。

**思路**:`dp[i][j]` 表示 `text1` 前 i 个与 `text2` 前 j 个字符的 LCS 长度。当前字符相等就继承左上 `dp[i-1][j-1]+1`,不等就取 `max(dp[i-1][j], dp[i][j-1])`。

```js
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  // 第一步:(m+1)×(n+1) 的 dp,多一行一列存空串状态
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // 第二步:逐字符填表
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        // 字符相等,接上左上角
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // 不等,取上方与左方较大
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

**复杂度**:时间 O(m × n),空间 O(m × n)。
