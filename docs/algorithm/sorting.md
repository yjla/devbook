---
sidebar_position: 9
sidebar_label: 排序
---

# 排序

:::warning
2022 年面试备战时期的旧笔记，内容待逐步重构或归档，新整理的内容见本分类下各篇文章。
:::



[前端该如何准备数据结构和算法？ - 掘金](https://juejin.cn/post/6844903919722692621)



## 排序

[八大基础排序总结 - 掘金](https://juejin.cn/post/6844903583301763085)

## 冒泡排序

冒泡排序是一种算法，用于比较相邻元素，并在相邻元素未按预期顺序交换时交换它们的位置。顺序可以是升序或降序。

Bubble sort is an algorithm that compares the adjacent elements and swaps their positions if they are not in the intended order. The order can be ascending or descending.



### 如何执行

1. 从第一个索引开始，比较第一个和第二个元素，如果第一个元素大于第二个元素，则将它们交换。

   Starting from the first index, compare the first and the second elements. If the first element is greater than the second element, they are swapped.

   现在，比较第二个和第三个元素。如果它们不正常，请交换它们。

   Now, compare the second and the third elements. Swap them if they are not in order.

   上面的过程一直持续到最后一个元素。

   The above process goes on until the last element.

![Bubble Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Bubble-sort-0.png)



2. 其余迭代将继续相同的过程。每次迭代后，未排序元素中的最大元素将放置在末尾。

   The same process goes on for the remaining iterations. After each iteration, the largest element among the unsorted elements is placed at the end.

   在每次迭代中，都会进行比较直到最后一个未排序的元素。

   In each iteration, the comparison takes place up to the last unsorted element.

   当所有未排序的元素都放置在其正确位置时，对数组进行排序。

   The array is sorted when all the unsorted elements are placed at their correct positions.

![Bubble Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Bubble-sort-1.png)

![Bubble Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Bubble-sort-2.png)

![Bubble Sort steps](https://cdn.programiz.com/sites/tutorial2program/files/Bubble-sort-3.png)



------

### 代码实现

**Pseudocode**

```
bubbleSort(array)
  for i <- 1 to indexOfLastUnsortedElement-1
    if leftElement > rightElement
      swap leftElement and rightElement
end bubbleSort
```



**Python**

```python
# Bubble sort in Python


def bubbleSort(array):
    
    # run loops two times: one for walking throught the array 
    # and the other for comparison
    for i in range(len(array)):
        for j in range(0, len(array) - i - 1):

            # To sort in descending order, change > to < in this line.
            if array[j] > array[j + 1]:
                
                # swap if greater is at the rear position
                (array[j], array[j + 1]) = (array[j + 1], array[j])


data = [-2, 45, 0, 11, -9]
bubbleSort(data)
print('Sorted Array in Asc ending Order:')
print(data)
```



**Java**

```java
// Bubble sort in Java

import java.util.Arrays;

class BubbleSort {
  void bubbleSort(int array[]) {
    int size = array.length;
    
    // run loops two times: one for walking throught the array
    // and the other for comparison
    for (int i = 0; i < size - 1; i++)
      for (int j = 0; j < size - i - 1; j++)

        // To sort in descending order, change > to < in this line.
        if (array[j] > array[j + 1]) {

          // swap if greater is at the rear position
          int temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
  }

  // driver code
  public static void main(String args[]) {
    int[] data = { -2, 45, 0, 11, -9 };
    BubbleSort bs = new BubbleSort();
    bs.bubbleSort(data);
    System.out.println("Sorted Array in Ascending Order:");
    System.out.println(Arrays.toString(data));
  }
}
```



**C**

```c
// Bubble sort in C

#include <stdio.h>

void bubbleSort(int array[], int size) {

  // run loops two times: one for walking throught the array
  // and the other for comparison
  for (int step = 0; step < size - 1; ++step) {
    for (int i = 0; i < size - step - 1; ++i) {
      
      // To sort in descending order, change">" to "<".
      if (array[i] > array[i + 1]) {
        
        // swap if greater is at the rear position
        int temp = array[i];
        array[i] = array[i + 1];
        array[i + 1] = temp;
      }
    }
  }
}

// function to print the array
void printArray(int array[], int size) {
  for (int i = 0; i < size; ++i) {
    printf("%d  ", array[i]);
  }
  printf("\n");
}

// driver code
int main() {
  int data[] = {-2, 45, 0, 11, -9};
  int size = sizeof(data) / sizeof(data[0]);
  bubbleSort(data, size);
  printf("Sorted Array in Ascending Order:\n");
  printArray(data, size);
}
```



------

### 复杂度

该算法使用了两层循环。

Two loops are implemented in the algorithm.

| Cycle   | Number of Comparisons |
| :------ | :-------------------- |
| 1st     | (n-1)                 |
| 2nd     | (n-2)                 |
| 3rd     | (n-3)                 |
| ....... | ......                |
| last    | 1                     |



时间复杂度：

- 最坏情况：O(n^2^)

  如果我们要以升序排序，而数组是以降序排列，那么就会发生最坏情况。

  If we want to sort in ascending order and the array is in descending order then, the worst case occurs.

- 最优情况：`O(n)`

  如果我们要以升序排序，而数组是以降序排列，那么就会发生最坏情况。

  If the array is already sorted, then there is no need for sorting.

- 平均情况：O(n^2^)

  当数组的元素处于混乱顺序（既不升也不降）时，会发生这种情况。

  It occurs when the elements of the array are in jumbled order (neither ascending nor descending).

空间复杂度：`O(1)`



### 应用场景

- 对代码的复杂度没有要求。

  The complexity of the code does not matter.

- 更偏向于短代码。

  A short code is preferred.



## 计数排序

计数排序是一种排序算法，它通过计算数组中每个唯一元素的出现次数来对数组的元素进行排序。将计数存储在辅助数组中，并通过将计数映射为辅助数组的索引来完成排序。

Counting sort is a sorting algorithm that sorts the elements of an array by counting the number of occurrences of each unique element in the array. The count is stored in an auxiliary array and the sorting is done by mapping the count as an index of the auxiliary array.



### 如何执行

1. 从给定数组中找出最大元素。

   Find out the maximum element from the given array.

![Counting Sort steps](https://cdn.programiz.com/sites/tutorial2program/files/Counting-sort-0_0.png)



2. 初始化一个长度为`max+1`的所有元素为0的数组。此数组用于存储数组中元素的数量。

   Initialize an array of length `max+1` with all elements 0. This array is used for storing the count of the elements in the array.

![Counting Sort Step](https://cdn.programiz.com/sites/tutorial2program/files/Counting-sort-1.png)



3. 将每个元素的计数存储在count数组中它们各自的索引处。例如：如果元素3的计数为2，则将2存储在元素的第3个位置计数数组。如果数组中不存在元素“ 5”，则在第5个位置存储0。

   Store the count of each element at their respective index in count array. For example: if the count of element 3 is 2 then, 2 is stored in the 3rd position of count array. If element "5" is not present in the array, then 0 is stored in 5th position.

![Counting Sort Step](https://cdn.programiz.com/sites/tutorial2program/files/Counting-sort-2.png)



4. 存储计数数组元素的累积和。它有助于将元素放入已排序数组的正确索引中。

   Store cumulative sum of the elements of the count array. It helps in placing the elements into the correct index of the sorted array.

![Counting Sort Step](https://cdn.programiz.com/sites/tutorial2program/files/Counting-sort-3.png)



5. 在count数组中找到原始数组的每个元素的索引。这给出了累计计数。将元素放置在计算出的索引处，如下图所示。

   Find the index of each element of the original array in the count array. This gives the cumulative count. Place the element at the index calculated as shown in figure below.

![Counting Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Counting-sort-4_1.png)



6. 将每个元素放置在正确位置后，将其数量减少一。

   After placing each element at its correct position, decrease its count by one.



------

### 代码实现

**Pseudocode**

```
countingSort(array, size)
  max <- find largest element in array
  initialize count array with all zeros
  for j <- 0 to size
    find the total count of each unique element and 
    store the count at jth index in count array
  for i <- 1 to max
    find the cumulative sum and store it in count array itself
  for j <- size down to 1
    restore the elements to array
    decrease count of each element restored by 1
```



**Python**

```python
# Counting sort in Python programming


def countingSort(array):
    size = len(array)
    output = [0] * size

    # Initialize count array
    count = [0] * 10

    # Store the count of each elements in count array
    for i in range(0, size):
        count[array[i]] += 1

    # Store the cummulative count
    for i in range(1, 10):
        count[i] += count[i - 1]

    # Find the index of each element of the original array in count array
    # place the elements in output array
    i = size - 1
    while i >= 0:
        output[count[array[i]] - 1] = array[i]
        count[array[i]] -= 1
        i -= 1

    # Copy the sorted elements into original array
    for i in range(0, size):
        array[i] = output[i]


data = [4, 2, 2, 8, 3, 3, 1]
countingSort(data)
print("Sorted Array in Ascending Order: ")
print(data)
```



**Java**

```java
// Counting sort in Java programming

import java.util.Arrays;

class CountingSort {
  void countSort(int array[], int size) {
    int[] output = new int[size + 1];

    // Find the largest element of the array
    int max = array[0];
    for (int i = 1; i < size; i++) {
      if (array[i] > max)
        max = array[i];
    }
    int[] count = new int[max + 1];

    // Initialize count array with all zeros.
    for (int i = 0; i < max; ++i) {
      count[i] = 0;
    }

    // Store the count of each element
    for (int i = 0; i < size; i++) {
      count[array[i]]++;
    }

    // Store the cummulative count of each array
    for (int i = 1; i <= max; i++) {
      count[i] += count[i - 1];
    }

    // Find the index of each element of the original array in count array, and
    // place the elements in output array
    for (int i = size - 1; i >= 0; i--) {
      output[count[array[i]] - 1] = array[i];
      count[array[i]]--;
    }

    // Copy the sorted elements into original array
    for (int i = 0; i < size; i++) {
      array[i] = output[i];
    }
  }

  // Driver code
  public static void main(String args[]) {
    int[] data = { 4, 2, 2, 8, 3, 3, 1 };
    int size = data.length;
    CountingSort cs = new CountingSort();
    cs.countSort(data, size);
    System.out.println("Sorted Array in Ascending Order: ");
    System.out.println(Arrays.toString(data));
  }
}
```



**C**

```c
// Counting sort in C programming

#include <stdio.h>

void countingSort(int array[], int size) {
  int output[10];

  // Find the largest element of the array
  int max = array[0];
  for (int i = 1; i < size; i++) {
    if (array[i] > max)
      max = array[i];
  }

  // The size of count must be at least (max+1) but
  // we cannot declare it as int count(max+1) in C as
  // it does not support dynamic memory allocation.
  // So, its size is provided statically.
  int count[10];

  // Initialize count array with all zeros.
  for (int i = 0; i <= max; ++i) {
    count[i] = 0;
  }

  // Store the count of each element
  for (int i = 0; i < size; i++) {
    count[array[i]]++;
  }

  // Store the cummulative count of each array
  for (int i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  // Find the index of each element of the original array in count array, and
  // place the elements in output array
  for (int i = size - 1; i >= 0; i--) {
    output[count[array[i]] - 1] = array[i];
    count[array[i]]--;
  }

  // Copy the sorted elements into original array
  for (int i = 0; i < size; i++) {
    array[i] = output[i];
  }
}

// Function to print an array
void printArray(int array[], int size) {
  for (int i = 0; i < size; ++i) {
    printf("%d  ", array[i]);
  }
  printf("\n");
}

// Driver code
int main() {
  int array[] = {4, 2, 2, 8, 3, 3, 1};
  int n = sizeof(array) / sizeof(array[0]);
  countingSort(array, n);
  printArray(array, n);
}
```



### 复杂度

主要有四层循环。

| for-loop | time of counting |
| :------- | :--------------- |
| 1st      | O(max)           |
| 2nd      | O(size)          |
| 3rd      | O(max)           |
| 4th      | O(size)          |



时间复杂度：

Overall complexity = `O(max)+O(size)+O(max)+O(size)` = `O(max+size)`

- 最坏情况：`O(n+k)`
- 最优情况：`O(n+k)`
- 平均情况：`O(n+k)`

在上述所有情况下，复杂度都是相同的，因为无论元素如何放置在数组中，算法都会经历`n+k`时间。

In all the above cases, the complexity is the same because no matter how the elements are placed in the array, the algorithm goes through `n+k` times.

没有任何元素之间的比较，因此它比基于比较的排序技术要好。但是，如果整数很大，那是不好的，因为应该制作该大小的数组。

There is no comparison between any elements, so it is better than comparison based sorting techniques. But, it is bad if the integers are very large because the array of that size should be made.

空间复杂度：`O(max)`



### 应用场景

- 有多个较小的整数。

  There are smaller integers with multiple counts.

- 线性复杂度是必要的。

  Linear complexity is the need.



## 基数排序



Radix sort is a sorting technique that sorts the elements by first grouping the individual digits of the same **place value**. Then, sort the elements according to their increasing/decreasing order.

基数排序是一种排序技术，它通过首先将相同**位置值**的各个数字分组来对元素进行排序。然后，根据元素的升序/降序对它们进行排序。

Suppose, we have an array of 8 elements. First, we will sort elements based on the value of the unit place. Then, we will sort elements based on the value of the tenth place. This process goes on until the last significant place.

假设我们有8个元素组成的数组。首先，我们将基于单位位置的值对元素进行排序。然后，我们将根据第十位的值对元素进行排序。这个过程一直持续到最后一个重要位置。

![Radix Sort Working](https://cdn.programiz.com/sites/tutorial2program/files/Radix-sort-0_0.png)

### 如何执行

1. 找到数组中最大的元素`max`。在这个数组中`[121, 432, 564, 23, 1, 45, 788]`，我们有最大的数字788。它有3个数字。因此，循环应上升到数百位（3次）。

   Find the largest element in the array `max`. Let `X` be the number of digits in `max`. In this array `[121, 432, 564, 23, 1, 45, 788]`, we have the largest number 788. It has 3 digits. Therefore, the loop should go up to hundreds place (3 times).

2. 使用任何稳定的排序技术对每个重要位置的数字进行排序。

   Use any stable sorting technique to sort the digits at each significant place. We have used counting sort for this.

   根据单位位数对元素进行排序。

   Sort the elements based on the unit place digits.

![Radix Sort working with Counting Sort as intermediate step](https://cdn.programiz.com/sites/tutorial2program/files/Radix-sort-one.png)

3. 现在，基于十位数字对元素进行排序

   Now, sort the elements based on digits at tens place.

![Radix Sort Step](https://cdn.programiz.com/sites/tutorial2program/files/Radix-sort-ten.png)

4. 最后，根据数百位数字对元素进行排序。

   Finally, sort the elements based on the digits at hundreds place.

![Selection Sort Step](https://cdn.programiz.com/sites/tutorial2program/files/Radix-sort-hundred.png)

### 代码实现

**Pseudocode**

```
radixSort(array)
  d <- maximum number of digits in the largest element
  create d buckets of size 0-9
  for i <- 0 to d
    sort the elements according to ith place digits using countingSort

countingSort(array, d)
  max <- find largest element among dth place elements
  initialize count array with all zeros
  for j <- 0 to size
    find the total count of each unique digit in dth place of elements and
    store the count at jth index in count array
  for i <- 1 to max
    find the cumulative sum and store it in count array itself
  for j <- size down to 1
    restore the elements to array
    decrease count of each element restored by 1
```



**Python**

```python
# Radix sort in Python


# Using counting sort to sort the elements in the basis of significant places
def countingSort(array, place):
    size = len(array)
    output = [0] * size
    count = [0] * 10

    # Calculate count of elements
    for i in range(0, size):
        index = array[i] // place
        count[index % 10] += 1

    # Calculate cummulative count
    for i in range(1, 10):
        count[i] += count[i - 1]

    # Place the elements in sorted order
    i = size - 1
    while i >= 0:
        index = array[i] // place
        output[count[index % 10] - 1] = array[i]
        count[index % 10] -= 1
        i -= 1

    for i in range(0, size):
        array[i] = output[i]


# Main function to implement radix sort
def radixSort(array):
    # Get maximum element
    max_element = max(array)

    # Apply counting sort to sort elements based on place value.
    place = 1
    while max_element // place > 0:
        countingSort(array, place)
        place *= 10


data = [121, 432, 564, 23, 1, 45, 788]
radixSort(data)
print(data)
```



**Java**

```java
// Radix Sort in Java Programming

import java.util.Arrays;

class RadixSort {

  // Using counting sort to sort the elements in the basis of significant places
  void countingSort(int array[], int size, int place) {
    int[] output = new int[size + 1];
    int max = array[0];
    for (int i = 1; i < size; i++) {
      if (array[i] > max)
        max = array[i];
    }
    int[] count = new int[max + 1];

    for (int i = 0; i < max; ++i)
      count[i] = 0;

    // Calculate count of elements
    for (int i = 0; i < size; i++)
      count[(array[i] / place) % 10]++;

    // Calculate cummulative count
    for (int i = 1; i < 10; i++)
      count[i] += count[i - 1];

    // Place the elements in sorted order
    for (int i = size - 1; i >= 0; i--) {
      output[count[(array[i] / place) % 10] - 1] = array[i];
      count[(array[i] / place) % 10]--;
    }

    for (int i = 0; i < size; i++)
      array[i] = output[i];
  }

  // Function to get the largest element from an array
  int getMax(int array[], int n) {
    int max = array[0];
    for (int i = 1; i < n; i++)
      if (array[i] > max)
        max = array[i];
    return max;
  }

  // Main function to implement radix sort
  void radixSort(int array[], int size) {
    // Get maximum element
    int max = getMax(array, size);

    // Apply counting sort to sort elements based on place value.
    for (int place = 1; max / place > 0; place *= 10)
      countingSort(array, size, place);
  }

  // Driver code
  public static void main(String args[]) {
    int[] data = { 121, 432, 564, 23, 1, 45, 788 };
    int size = data.length;
    RadixSort rs = new RadixSort();
    rs.radixSort(data, size);
    System.out.println("Sorted Array in Ascending Order: ");
    System.out.println(Arrays.toString(data));
  }
}
```



**C**

```c
// Radix Sort in C Programming

#include <stdio.h>

// Function to get the largest element from an array
int getMax(int array[], int n) {
  int max = array[0];
  for (int i = 1; i < n; i++)
    if (array[i] > max)
      max = array[i];
  return max;
}

// Using counting sort to sort the elements in the basis of significant places
void countingSort(int array[], int size, int place) {
  int output[size + 1];
  int max = (array[0] / place) % 10;

  for (int i = 1; i < size; i++) {
    if (((array[i] / place) % 10) > max)
      max = array[i];
  }
  int count[max + 1];

  for (int i = 0; i < max; ++i)
    count[i] = 0;

  // Calculate count of elements
  for (int i = 0; i < size; i++)
    count[(array[i] / place) % 10]++;
    
  // Calculate cummulative count
  for (int i = 1; i < 10; i++)
    count[i] += count[i - 1];

  // Place the elements in sorted order
  for (int i = size - 1; i >= 0; i--) {
    output[count[(array[i] / place) % 10] - 1] = array[i];
    count[(array[i] / place) % 10]--;
  }

  for (int i = 0; i < size; i++)
    array[i] = output[i];
}

// Main function to implement radix sort
void radixsort(int array[], int size) {
  // Get maximum element
  int max = getMax(array, size);

  // Apply counting sort to sort elements based on place value.
  for (int place = 1; max / place > 0; place *= 10)
    countingSort(array, size, place);
}

// Print an array
void printArray(int array[], int size) {
  for (int i = 0; i < size; ++i) {
    printf("%d  ", array[i]);
  }
  printf("\n");
}

// Driver code
int main() {
  int array[] = {121, 432, 564, 23, 1, 45, 788};
  int n = sizeof(array) / sizeof(array[0]);
  radixsort(array, n);
  printArray(array, n);
}
```



### 复杂度

由于基数排序是一种非比较算法，因此它比比较排序算法具有优势。

Since radix sort is a non-comparative algorithm, it has advantages over comparative sorting algorithms.

对于使用计数排序作为中间稳定排序的基数排序，时间复杂度为`O(d(n+k))`。

For the radix sort that uses counting sort as an intermediate stable sort, the time complexity is `O(d(n+k))`.

在这里，`d`是数字周期，`O(n+k)`是计数排序的时间复杂度。

Here, `d` is the number cycle and `O(n+k)` is the time complexity of counting sort.

因此，基数排序具有线性时间复杂度，这比`O(nlog n)`比较排序算法要好。

Thus, radix sort has linear time complexity which is better than `O(nlog n)` of comparative sorting algorithms.

如果我们使用非常大的数字或其他基数（例如32位和64位数字），则它可以在线性时间内执行，但是中间排序会占用很大的空间。

If we take very large digit numbers or the number of other bases like 32-bit and 64-bit numbers then it can perform in linear time however the intermediate sort takes large space.

这使得基数排序空间效率低下。这就是为什么在软件库中不使用这种排序的原因。

This makes radix sort space inefficient. This is the reason why this sort is not used in software libraries.



### 应用场景

- 制作后缀数组时使用DC3算法

  DC3 algorithm while making a suffix array.

- 大范围数字的地方

  places where there are numbers in large ranges.



## 桶排序



桶排序是一种排序技术，它通过首先将元素分为几组称为**桶**的元素来对元素进行排序。使用适当的排序算法中的任何一个或递归调用相同的算法对每个**存储桶**中的元素进行排序。

Bucket Sort is a sorting technique that sorts the elements by first dividing the elements into several groups called **buckets**. The elements inside each **bucket** are sorted using any of the suitable sorting algorithms or recursively calling the same algorithm.

创建了几个存储桶。每个存储桶都充满特定范围的元素。存储桶中的元素使用任何其他算法进行排序。最后，收集存储桶中的元素以获取排序后的数组。

Several buckets are created. Each bucket is filled with a specific range of elements. The elements inside the bucket are sorted using any other algorithm. Finally, the elements of the bucket are gathered to get the sorted array.

桶分类的过程可以理解为**分散收集**方法。首先将元素分散到存储桶中，然后对存储桶的元素进行排序。最后，元素按顺序收集。

The process of bucket sort can be understood as **a scatter-gather** approach. The elements are first scattered into buckets then the elements of buckets are sorted. Finally, the elements are gathered in order.

![Bucket Sort Working](https://cdn.programiz.com/sites/tutorial2program/files/Bucket_2.png)



### 代码实现

1. 假设输入数组为：

   Suppose, the input array is:

   ![Bucket Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Bucket-sort-0.1_0.png)

   创建一个大小为10的数组。此数组的每个插槽都用作存储元素的存储桶。

   Create an array of size 10. Each slot of this array is used as a bucket for storing elements.

   ![Bucket Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Bucket-sort-0_0.png)

2. 将元素插入数组中的存储桶。根据桶的范围插入元素。如果我们将整数作为输入，则必须将其除以间隔（此处为10）以获取下限值。

   Insert elements into the buckets from the array. The elements are inserted according to the range of the bucket. If we take integer numbers as input, we have to divide it by the interval (10 here) to get the floor value.

   ![Bucket Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Bucket-sort-0.2_0.png)

   ![Bucket Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Bucket-sort-0.3_0.png)

3. 使用任何稳定的排序算法对每个存储桶的元素进行排序。在这里，我们使用了quicksort（内置函数）。

   The elements of each bucket are sorted using any of the stable sorting algorithms. Here, we have used quicksort (inbuilt function).

   ![Bucket Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Bucket-sort-0.4_0.png)

4. 收集每个存储桶中的元素。

   The elements from each bucket are gathered.

   通过遍历存储桶并在每个循环中将单个元素插入原始数组来完成此操作。一旦将存储桶中的元素复制到原始数组中，该元素将被擦除。

   It is done by iterating through the bucket and inserting an individual element into the original array in each cycle. The element from the bucket is erased once it is copied into the original array.

   ![Bucket Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/Bucket-sort-0.5_0.png)



### 代码实现



**Pseudocode**

```
bucketSort()
  create N buckets each of which can hold a range of values
  for all the buckets
    initialize each bucket with 0 values
  for all the buckets
    put elements into buckets matching the range
  for all the buckets 
    sort elements in each bucket
  gather elements from each bucket
end bucketSort
```



**Python**

```python
# Bucket Sort in Python


def bucketSort(array):
    bucket = []

    # Create empty buckets
    for i in range(len(array)):
        bucket.append([])

    # Insert elements into their respective buckets
    for j in array:
        index_b = int(10 * j)
        bucket[index_b].append(j)

    # Sort the elements of each bucket
    for i in range(len(array)):
        bucket[i] = sorted(bucket[i])

    # Get the sorted elements
    k = 0
    for i in range(len(array)):
        for j in range(len(bucket[i])):
            array[k] = bucket[i][j]
            k += 1
    return array


array = [.42, .32, .33, .52, .37, .47, .51]
print("Sorted Array in descending order is")
print(bucketSort(array))
```



**Java**

```java
// Bucket sort in Java

import java.util.ArrayList;
import java.util.Collections;

public class BucketSort {
  public void bucketSort(float[] arr, int n) {
    if (n <= 0)
      return;
    @SuppressWarnings("unchecked")
    ArrayList<Float>[] bucket = new ArrayList[n];

    // Create empty buckets
    for (int i = 0; i < n; i++)
      bucket[i] = new ArrayList<Float>();

    // Add elements into the buckets
    for (int i = 0; i < n; i++) {
      int bucketIndex = (int) arr[i] * n;
      bucket[bucketIndex].add(arr[i]);
    }

    // Sort the elements of each bucket
    for (int i = 0; i < n; i++) {
      Collections.sort((bucket[i]));
    }

    // Get the sorted array
    int index = 0;
    for (int i = 0; i < n; i++) {
      for (int j = 0, size = bucket[i].size(); j < size; j++) {
        arr[index++] = bucket[i].get(j);
      }
    }
  }

  // Driver code
  public static void main(String[] args) {
    BucketSort b = new BucketSort();
    float[] arr = { (float) 0.42, (float) 0.32, (float) 0.33, (float) 0.52, (float) 0.37, (float) 0.47,
        (float) 0.51 };
    b.bucketSort(arr, 7);

    for (float i : arr)
      System.out.print(i + "  ");
  }
}
```



**C**

```c
// Bucket sort in C

#include <stdio.h>
#include <stdlib.h>

#define NARRAY 7   // Array size
#define NBUCKET 6  // Number of buckets
#define INTERVAL 10  // Each bucket capacity

struct Node {
  int data;
  struct Node *next;
};

void BucketSort(int arr[]);
struct Node *InsertionSort(struct Node *list);
void print(int arr[]);
void printBuckets(struct Node *list);
int getBucketIndex(int value);

// Sorting function
void BucketSort(int arr[]) {
  int i, j;
  struct Node **buckets;

  // Create buckets and allocate memory size
  buckets = (struct Node **)malloc(sizeof(struct Node *) * NBUCKET);

  // Initialize empty buckets
  for (i = 0; i < NBUCKET; ++i) {
    buckets[i] = NULL;
  }

  // Fill the buckets with respective elements
  for (i = 0; i < NARRAY; ++i) {
    struct Node *current;
    int pos = getBucketIndex(arr[i]);
    current = (struct Node *)malloc(sizeof(struct Node));
    current->data = arr[i];
    current->next = buckets[pos];
    buckets[pos] = current;
  }

  // Print the buckets along with their elements
  for (i = 0; i < NBUCKET; i++) {
    printf("Bucket[%d]: ", i);
    printBuckets(buckets[i]);
    printf("\n");
  }

  // Sort the elements of each bucket
  for (i = 0; i < NBUCKET; ++i) {
    buckets[i] = InsertionSort(buckets[i]);
  }

  printf("-------------\n");
  printf("Bucktets after sorting\n");
  for (i = 0; i < NBUCKET; i++) {
    printf("Bucket[%d]: ", i);
    printBuckets(buckets[i]);
    printf("\n");
  }

  // Put sorted elements on arr
  for (j = 0, i = 0; i < NBUCKET; ++i) {
    struct Node *node;
    node = buckets[i];
    while (node) {
      arr[j++] = node->data;
      node = node->next;
    }
  }

  return;
}

// Function to sort the elements of each bucket
struct Node *InsertionSort(struct Node *list) {
  struct Node *k, *nodeList;
  if (list == 0 || list->next == 0) {
    return list;
  }

  nodeList = list;
  k = list->next;
  nodeList->next = 0;
  while (k != 0) {
    struct Node *ptr;
    if (nodeList->data > k->data) {
      struct Node *tmp;
      tmp = k;
      k = k->next;
      tmp->next = nodeList;
      nodeList = tmp;
      continue;
    }

    for (ptr = nodeList; ptr->next != 0; ptr = ptr->next) {
      if (ptr->next->data > k->data)
        break;
    }

    if (ptr->next != 0) {
      struct Node *tmp;
      tmp = k;
      k = k->next;
      tmp->next = ptr->next;
      ptr->next = tmp;
      continue;
    } else {
      ptr->next = k;
      k = k->next;
      ptr->next->next = 0;
      continue;
    }
  }
  return nodeList;
}

int getBucketIndex(int value) {
  return value / INTERVAL;
}

void print(int ar[]) {
  int i;
  for (i = 0; i < NARRAY; ++i) {
    printf("%d ", ar[i]);
  }
  printf("\n");
}

// Print buckets
void printBuckets(struct Node *list) {
  struct Node *cur = list;
  while (cur) {
    printf("%d ", cur->data);
    cur = cur->next;
  }
}

// Driver code
int main(void) {
  int array[NARRAY] = {42, 32, 33, 52, 37, 47, 51};

  printf("Initial array: ");
  print(array);
  printf("-------------\n");

  BucketSort(array);
  printf("-------------\n");
  printf("Sorted array: ");
  print(array);
  return 0;
}
```



### 复杂度

**时间复杂度**

- **最坏情况：** O(n^2^)

  当数组中有近距离的元素时，它们很可能放在同一存储桶中。这可能会导致某些存储桶中的存储元素数量比其他存储桶更多。这使得复杂度取决于用于对存储桶元素进行排序的排序算法。

  When there are elements of close range in the array, they are likely to be placed in the same bucket. This may result in some buckets having more number of elements than others. It makes the complexity depend on the sorting algorithm used to sort the elements of the bucket.

  当元素按相反顺序排列时，复杂性将变得更糟。如果使用插入排序对存储桶中的元素进行排序，则时间复杂度变为 O(n^2^)。


  The complexity becomes even worse when the elements are in reverse order. If insertion sort is used to sort elements of the bucket, then the time complexity becomes O(n^2^).

- **最优情况：** `O(n+k)`

  当元素在存储桶中均匀分布且每个存储桶中元素数量几乎相等时，会发生这种情况。

  It occurs when the elements are uniformly distributed in the buckets with a nearly equal number of elements in each bucket.

  如果存储桶中的元素已经被排序，那么复杂性就会变得更好。

  The complexity becomes even better if the elements inside the buckets are already sorted.

  如果使用插入排序对存储桶中的元素进行排序，则最佳情况下的总体复杂度将是线性的。`O(n+k)`。`O(n)`是制造桶`O(k)`的复杂度，是在最佳情况下使用具有线性时间复杂度的算法对桶的元素进行分类的复杂度。

  If insertion sort is used to sort elements of a bucket then the overall complexity in the best case will be linear ie. `O(n+k)`. `O(n)` is the complexity for making the buckets and `O(k)` is the complexity for sorting the elements of the bucket using algorithms having linear time complexity at the best case.

- **平均情况** `O(n)`

  当元素在数组中随机分布时发生。即使元素分布不均匀，存储桶排序也会在线性时间内运行。直到铲斗尺寸的平方和之和在元素总数中呈线性关系时，它才成立。

  It occurs when the elements are distributed randomly in the array. Even if the elements are not distributed uniformly, bucket sort runs in linear time. It holds true until the sum of the squares of the bucket sizes is linear in the total number of elements.



### 应用场景

- 输入在一个范围内均匀分布。

  input is uniformly distributed over a range.

- 有浮点值

  there are floating point values



## 希尔排序



希尔排序是一种算法，该算法首先对彼此远离的元素进行排序，然后依次减小要排序的元素之间的间隔。它是插入排序的通用版本。

Shell sort is an algorithm that first sorts the elements far apart from each other and successively reduces the interval between the elements to be sorted. It is a generalized version of insertion sort.

在希尔排序中，将按特定间隔对元素进行排序。元素之间的间隔根据使用的顺序逐渐减小。希尔排序的性能取决于给定输入数组使用的序列类型。

In shell sort, elements at a specific interval are sorted. The interval between the elements is gradually decreased based on the sequence used. The performance of the shell sort depends on the type of sequence used for a given input array.

一些常用的排序

- Shell's original sequence: `N/2 , N/4 , …, 1`
- Knuth's increments: `1, 4, 13, …, (3k – 1) / 2`
- Sedgewick's increments: `1, 8, 23, 77, 281, 1073, 4193, 16577...4j+1+ 3·2j+ 1`
- Hibbard's increments: `1, 3, 7, 15, 31, 63, 127, 255, 511…`
- Papernov & Stasevich increment: `1, 3, 5, 9, 17, 33, 65,...`
- Pratt: `1, 2, 3, 4, 6, 9, 8, 12, 18, 27, 16, 24, 36, 54, 81....`



### 如何执行

1. 假设我们需要对以下数组进行排序。

   Suppose, we need to sort the following array.

   ![Shell sort step](https://cdn.programiz.com/sites/tutorial2program/files/shell-sort-0.0.png)

2. 我们使用原始希尔序列 `(N/2, N/4, ...1` 作为间隔。

   We are using the shell's original sequence `(N/2, N/4, ...1)` as intervals in our algorithm.

   在第一个循环中，如果数组大小为0 `N = 8`，则对间隔为的元素`N/2 = 4`进行比较并交换（如果它们不按顺序排列）。

   In the first loop, if the array size is `N = 8`, then the elements lying at the interval of `N/2 = 4` are compared and swapped if they are not in order.

   a. 将`0th`与`4th`比较。

   ​	The `0th` element is compared with the `4th` element.

   b. 如果第`0th`元素大于`4th`然后， `4th`首先将元素存储在`temp`变量中，并将`0th`元素（即更大的元素）存储在该`4th`位置中，将其中存储的元素`temp`	存储在该`0th`位置中。

   ​	If the `0th` element is greater than the `4th` one then, the `4th` element is first stored in `temp` variable and the `0th` element is stored in the `4th` 	position and the element stored in `temp` is stored in the `0th` position.

   ![Shell Sort step](https://cdn.programiz.com/sites/tutorial2program/files/shell-sort-0.1.png)

   对于所有其余元素，此过程将继续进行。

   This process goes on for all the remaining elements.

   ![Shell Sort steps](https://cdn.programiz.com/sites/tutorial2program/files/shell-sort-0.2.png)

3. 在第二个循环中，采用的间隔，`N/4 = 8/4 = 2`并再次对位于这些间隔的元素进行排序。

   In the second loop, an interval of `N/4 = 8/4 = 2` is taken and again the elements lying at these intervals are sorted.

   ![Shell Sort step](https://cdn.programiz.com/sites/tutorial2program/files/shell-sort-0.3.png)

   ![Shell Sort step](https://cdn.programiz.com/sites/tutorial2program/files/shell-sort-0.4.png)

4. 其余元素的处理相同。

   The same process goes on for remaining elements.

   ![Shell Sort step](https://cdn.programiz.com/sites/tutorial2program/files/shell-sort-0.5.png)

5. 最后，当间隔`N/8 = 8/8 =1`为时，对间隔为1的数组元素进行排序。现在，该数组已完全排序。

   Finally, when the interval is `N/8 = 8/8 =1` then the array elements lying at the interval of 1 are sorted. The array is now completely sorted.

   ![Shell Sort step](https://cdn.programiz.com/sites/tutorial2program/files/shell-sort-0.6.png)



### 代码实现



**Pseudocode**

```
shellSort(array, size)
  for interval i <- size/2n down to 1
    for each interval "i" in array
        sort all the elements at interval "i"
end shellSort
```



**Python**

```python
# Shell sort in python


def shellSort(array, n):

    # Rearrange elements at each n/2, n/4, n/8, ... intervals
    interval = n // 2
    while interval > 0:
        for i in range(interval, n):
            temp = array[i]
            j = i
            while j >= interval and array[j - interval] > temp:
                array[j] = array[j - interval]
                j -= interval

            array[j] = temp
        interval //= 2


data = [9, 8, 3, 7, 5, 6, 4, 1]
size = len(data)
shellSort(data, size)
print('Sorted Array in Ascending Order:')
print(data)
```



**Java**

```java
// Shell sort in Java programming

import java.util.Arrays;

// Shell sort
class ShellSort {

  // Rearrange elements at each n/2, n/4, n/8, ... intervals
  void shellSort(int array[], int n) {
  for (int interval = n / 2; interval > 0; interval /= 2) {
    for (int i = interval; i < n; i += 1) {
    int temp = array[i];
    int j;
    for (j = i; j >= interval && array[j - interval] > temp; j -= interval) {
      array[j] = array[j - interval];
    }
    array[j] = temp;
    }
  }
  }

  // Driver code
  public static void main(String args[]) {
  int[] data = { 9, 8, 3, 7, 5, 6, 4, 1 };
  int size = data.length;
  ShellSort ss = new ShellSort();
  ss.shellSort(data, size);
  System.out.println("Sorted Array in Ascending Order: ");
  System.out.println(Arrays.toString(data));
  }
}
```



**C**

```c
// Shell Sort in C programming

#include <stdio.h>

// Shell sort
void shellSort(int array[], int n) {
  // Rearrange elements at each n/2, n/4, n/8, ... intervals
  for (int interval = n / 2; interval > 0; interval /= 2) {
    for (int i = interval; i < n; i += 1) {
      int temp = array[i];
      int j;
      for (j = i; j >= interval && array[j - interval] > temp; j -= interval) {
        array[j] = array[j - interval];
      }
      array[j] = temp;
    }
  }
}

// Print an array
void printArray(int array[], int size) {
  for (int i = 0; i < size; ++i) {
    printf("%d  ", array[i]);
  }
  printf("\n");
}

// Driver code
int main() {
  int data[] = {9, 8, 3, 7, 5, 6, 4, 1};
  int size = sizeof(data) / sizeof(data[0]);
  shellSort(data, size);
  printf("Sorted array: \n");
  printArray(data, size);
}
```



### 复杂度

**时间复杂度**

- **最坏情况：**小于或等于 `O(n2)`
  据Poonen定理确定

- **最优情况：**`O(n*log n)`

  对数组进行排序后，每个时间间隔（或增量）的比较总数等于数组的大小。

  When the array is already sorted, the total number of comparisons for each interval (or increment) is equal to the size of the array.

- **平均情况：**`O(n*log n)`
  在 O(n^1.25^)左右



**空间复杂度**

希尔排序的空间复杂度：`O(1)`



### 应用场景

- 调用堆栈是开销。uClibc库使用这种排序。

  calling a stack is overhead. uClibc library uses this sort.

- 递归超出限制。bzip2压缩器使用它。

  recursion exceeds a limit. bzip2 compressor uses it.

- 当接近的元素相距很远时，插入排序的效果不佳。壳排序有助于缩短封闭元素之间的距离。因此，将执行的交换次数将更少。

  Insertion sort does not perform well when the close elements are far apart. Shell sort helps in reducing the distance between the close elements. Thus, there will be less number of swapping to be performed.



## 归并排序

归并排序是一种分治算法。它是最主流的排序算法之一，也是建立对构建递归算法的信心的一种好方法。

Merge Sort is a kind of Divide and Conquer algorithm in computer programming. It is one of the most popular sorting algorithms and a great way to develop confidence in building recursive algorithms.

![merge sort example](https://cdn.programiz.com/sites/tutorial2program/files/merge-sort-example_0.png)



### 如何执行

合并排序算法将数组递归地分成两半，直到我们得到具有1个元素的数组的基本情况。

The merge sort algorithm recursively divides the array into halves until we reach the base case of array with 1 element. 

之后，合并功能开始起作用，并将已排序的数组合并为更大的数组，直到合并整个数组。

After that, the merge function comes into play and combines the sorted arrays into larger arrays until the whole array is merged.

```
MergeSort(A, p, r):
    if p > r 
        return
    q = (p+r)/2
    mergeSort(A, p, q)
    mergeSort(A, q+1, r)
    merge(A, p, q, r)
```



![merge sort algorithm visualization](https://cdn.programiz.com/sites/tutorial2program/files/merge-sort-in-action---merge-step-simple.png)

![merge two sorted arrays](https://cdn.programiz.com/sites/tutorial2program/files/merge-two-sorted-arrays.png)



### 归并详解

数组 `A [0..5]` 包含两个排序的子数组 `A [0..3]` 和 `A [4..5]`。让我们看看merge函数如何合并两个数组。

The array `A[0..5]` contains two sorted subarrays `A[0..3]` and `A[4..5]`. Let us see how the merge function will merge the two arrays.

```c
void merge(int arr[], int p, int q, int r) {
// Here, p = 0, q = 4, r = 6 (size of array)
```

![Merging two consecutive subarrays of array](https://cdn.programiz.com/sites/tutorial2program/files/merge-sort-demo-step-1.png)

1. 创建要排序的子数组的重复副本

   Create duplicate copies of sub-arrays to be sorted



```c
    // Create L ← A[p..q] and M ← A[q+1..r]
    int n1 = q - p + 1 = 3 - 0 + 1 = 4;
    int n2 = r - q = 5 - 3 = 2;

    int L[4], M[2];

    for (int i = 0; i < 4; i++)
        L[i] = arr[p + i];
        // L[0,1,2,3] = A[0,1,2,3] = [1,5,10,12]

    for (int j = 0; j < 2; j++)
        M[j] = arr[q + 1 + j];
        // M[0,1,2,3] = A[4,5] = [6,9]
```

![Create copies of subarrays for merging](https://cdn.programiz.com/sites/tutorial2program/files/merge-sort-demo-step-2.png)

2. 维护子数组和主数组的当前索引

   Maintain current index of sub-arrays and main array



```c
    int i, j, k;
    i = 0; 
    j = 0; 
    k = p; 
```

![Maintain indices of copies of sub array and main array](https://cdn.programiz.com/sites/tutorial2program/files/merge-sort-demo-step-3.png)

3. 直到我们到达L或M的尽头，在元素L和M中选择更大的一个并将其放置在A [p..r]的正确位置

   Until we reach the end of either L or M, pick larger among elements L and M and place them in the correct position at A[p..r]



```c
    while (i < n1 && j < n2) { 
        if (L[i] <= M[j]) { 
            arr[k] = L[i]; i++; 
        } 
        else { 
            arr[k] = M[j]; 
            j++; 
        } 
        k++; 
    }
```

![Comparing individual elements of sorted subarrays until we reach end of one](https://cdn.programiz.com/sites/tutorial2program/files/merge-sort-demo-step-4.png)

4. 当我们用完L或M中的元素时，请拾取其余元素并放入A [p..r]

   When we run out of elements in either L or M, pick up the remaining elements and put in A[p..r]



```c
    // We exited the earlier loop because j < n2 doesn't hold
    while (i < n1)
    {
        arr[k] = L[i];
        i++;
        k++;
    }
```

![Copy the remaining elements from the first array to main subarray](https://cdn.programiz.com/sites/tutorial2program/files/merge-sort-demo-step-5.png)

如果M的大小大于L，则需要此步骤。

This step would have been needed if the size of M was greater than L.



```c
    // We exited the earlier loop because i < n1 doesn't hold  
    while (j < n2)
    {
        arr[k] = M[j];
        j++;
        k++;
    }
}
```

![Copy remaining elements of second array to main subarray](https://cdn.programiz.com/sites/tutorial2program/files/merge-sort-demo-step-6.png)Copy remaining 



### 代码实现

**Python**

```python
# MergeSort in Python


def mergeSort(array):
    if len(array) > 1:

        #  r is the point where the array is divided into two subarrays
        r = len(array)//2
        L = array[:r]
        M = array[r:]

        # Sort the two halves
        mergeSort(L)
        mergeSort(M)

        i = j = k = 0

        # Until we reach either end of either L or M, pick larger among
        # elements L and M and place them in the correct position at A[p..r]
        while i < len(L) and j < len(M):
            if L[i] < M[j]:
                array[k] = L[i]
                i += 1
            else:
                array[k] = M[j]
                j += 1
            k += 1

        # When we run out of elements in either L or M,
        # pick up the remaining elements and put in A[p..r]
        while i < len(L):
            array[k] = L[i]
            i += 1
            k += 1

        while j < len(M):
            array[k] = M[j]
            j += 1
            k += 1


# Print the array
def printList(array):
    for i in range(len(array)):
        print(array[i], end=" ")
    print()


# Driver program
if __name__ == '__main__':
    array = [6, 5, 12, 10, 9, 1]

    mergeSort(array)

    print("Sorted array is: ")
    printList(array)
```



**Java**

```java
// Merge sort in Java

class MergeSort {

  // Merge two subarrays L and M into arr
  void merge(int arr[], int p, int q, int r) {

    // Create L ← A[p..q] and M ← A[q+1..r]
    int n1 = q - p + 1;
    int n2 = r - q;

    int L[] = new int[n1];
    int M[] = new int[n2];

    for (int i = 0; i < n1; i++)
      L[i] = arr[p + i];
    for (int j = 0; j < n2; j++)
      M[j] = arr[q + 1 + j];

    // Maintain current index of sub-arrays and main array
    int i, j, k;
    i = 0;
    j = 0;
    k = p;

    // Until we reach either end of either L or M, pick larger among
    // elements L and M and place them in the correct position at A[p..r]
    while (i < n1 && j < n2) {
      if (L[i] <= M[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = M[j];
        j++;
      }
      k++;
    }

    // When we run out of elements in either L or M,
    // pick up the remaining elements and put in A[p..r]
    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = M[j];
      j++;
      k++;
    }
  }

  // Divide the array into two subarrays, sort them and merge them
  void mergeSort(int arr[], int l, int r) {
    if (l < r) {

      // m is the point where the array is divided into two subarrays
      int m = (l + r) / 2;

      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);

      // Merge the sorted subarrays
      merge(arr, l, m, r);
    }
  }

  // Print the array
  static void printArray(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n; ++i)
      System.out.print(arr[i] + " ");
    System.out.println();
  }

  // Driver program
  public static void main(String args[]) {
    int arr[] = { 6, 5, 12, 10, 9, 1 };

    MergeSort ob = new MergeSort();
    ob.mergeSort(arr, 0, arr.length - 1);

    System.out.println("Sorted array:");
    printArray(arr);
  }
}
```



**C**

```c
// Merge sort in C

#include <stdio.h>

// Merge two subarrays L and M into arr
void merge(int arr[], int p, int q, int r) {

  // Create L ← A[p..q] and M ← A[q+1..r]
  int n1 = q - p + 1;
  int n2 = r - q;

  int L[n1], M[n2];

  for (int i = 0; i < n1; i++)
    L[i] = arr[p + i];
  for (int j = 0; j < n2; j++)
    M[j] = arr[q + 1 + j];

  // Maintain current index of sub-arrays and main array
  int i, j, k;
  i = 0;
  j = 0;
  k = p;

  // Until we reach either end of either L or M, pick larger among
  // elements L and M and place them in the correct position at A[p..r]
  while (i < n1 && j < n2) {
    if (L[i] <= M[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = M[j];
      j++;
    }
    k++;
  }

  // When we run out of elements in either L or M,
  // pick up the remaining elements and put in A[p..r]
  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = M[j];
    j++;
    k++;
  }
}

// Divide the array into two subarrays, sort them and merge them
void mergeSort(int arr[], int l, int r) {
  if (l < r) {

    // m is the point where the array is divided into two subarrays
    int m = l + (r - l) / 2;

    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);

    // Merge the sorted subarrays
    merge(arr, l, m, r);
  }
}

// Print the array
void printArray(int arr[], int size) {
  for (int i = 0; i < size; i++)
    printf("%d ", arr[i]);
  printf("\n");
}

// Driver program
int main() {
  int arr[] = {6, 5, 12, 10, 9, 1};
  int size = sizeof(arr) / sizeof(arr[0]);

  mergeSort(arr, 0, size - 1);

  printf("Sorted array: \n");
  printArray(arr, size);
}
```



### 复杂度

**时间复杂度**

- **最优情况：**`O(n*log n)`
- **最坏情况：**`O(n*log n)`
- **平均情况：**`O(n*log n)`



**空间复杂度**

归并排序的空间复杂度：`O(n)`



### 应用场景

- 倒数问题

  Inversion count problem

- 外部排序

  External sorting

- 电子商务应用

  E-commerce applications





## 快速排序

快速排序是一种基于分而治之方法的算法，其中将数组拆分为子数组，然后递归调用这些子数组以对元素进行排序。

Quick sort is an algorithm based on divide and conquer approach in which the array is split into subarrays and these sub-arrays are recursively called to sort the elements.

 

### 如何执行

1. 从数组中选择枢轴元素。您可以从数组中选择任何元素作为枢轴元素。在这里，我们将数组的最右边（即最后一个元素）作为枢轴元素。

   A pivot element is chosen from the array. You can choose any element from the array as the pivot element. Here, we have taken the rightmost (the last element) of the array as the pivot element.

![Quick Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/quick-sort-0.1_0.png)

2. 小于枢轴元素的元素放在左侧，大于枢轴元素的元素放在右侧。

   The elements smaller than the pivot element are put on the left and the elements greater than the pivot element are put on the right.

![Quick Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/quick-sort-0.2_0.png)

​		通过以下步骤来实现上述布置。

​		在除去枢轴元素后剩下的数组中设置两个指针`left`和`right`。若`left`<`pivot`或者`right`>`pivot`，指针移动；若`left`>`pivot`或者`right`<`pivot`，			指针停止移动；当`left`>`pivot`且`right`<`pivot`，两者交换。过程持续至枢轴元素到达正确的位置。

​		The above arrangement is achieved by the following steps.

​			a. 指针固定在枢轴元件上。将枢轴元素与从第一个索引开始的元素进行比较。如果达到大于枢轴元素的元素，则为该元素设置第二个指针。

​			A pointer is fixed at the pivot element. The pivot element is compared with the elements beginning from the first index. If the element greater than 			the pivot element is reached, a second pointer is set for that element.

​			b. 现在，将枢轴元素与其他元素（第三个指针）进行比较。如果到达的元素小于枢轴元素，则将较小的元素交换为较早找到的较大的元素.

​			Now, the pivot element is compared with the other elements (a third pointer). If an element smaller than the pivot element is reached, the smaller 			element is swapped with the greater element found earlier.

![img](https://cdn.programiz.com/sites/tutorial2program/files/quick-sort-partition_1.png)

​			c. 该过程一直进行到到达倒数第二个元素为止。最后，将枢轴元素与第二个指针交换.

​				The process goes on until the second last element is reached. Finally, the pivot element is swapped with the second pointer.

![Quick Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/quick-sort-0.1-1.png)

3. 再次分别为左子部分和右子部分选择了枢轴元素。在这些子部件中，枢轴元件放置在正确的位置。然后，重复步骤2。

   Pivot elements are again chosen for the left and the right sub-parts separately. Within these sub-parts, the pivot elements are placed at their right position. Then, step 2 is repeated.

![Quick Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/quick-sort-0.3_0.png)

4. 将子部分再次划分为较小的子部分，直到每个子部分由单个元素形成。

   The sub-parts are again divided into smaller sub-parts until each subpart is formed of a single element.



### 快速排序中的分治思想

- 分解

  将数组分为多个子部分，这些子部分将枢轴作为分割点。小于枢轴的元素放置在枢轴的左侧，大于枢轴的元素放置在右侧。

  The array is divided into subparts taking pivot as the partitioning point. The elements smaller than the pivot are placed to the left of the pivot and the elements greater than the pivot are placed to the right.

- 解决

  左子部分和右子部分再次通过选择枢轴元素进行划分。这可以通过将子部分递归传递到算法中来实现。

  The left and the right subparts are again partitioned using the by selecting pivot elements for them. This can be achieved by recursively passing the subparts into the algorithm.

- 合并

  此步骤在快速排序中不起作用。该数组已在征服步骤的末尾排序。

  This step does not play a significant role in quicksort. The array is already sorted at the end of the conquer step.

![Quick Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/quick-sort-0.png)

![Quick Sort Steps](https://cdn.programiz.com/sites/tutorial2program/files/quick-sort-1.png)



### 代码实现

**Pseudocode**

```
quickSort(array, leftmostIndex, rightmostIndex)
  if (leftmostIndex < rightmostIndex)
    pivotIndex <- partition(array,leftmostIndex, rightmostIndex)
    quickSort(array, leftmostIndex, pivotIndex)
    quickSort(array, pivotIndex + 1, rightmostIndex)

partition(array, leftmostIndex, rightmostIndex)
  set rightmostIndex as pivotIndex
  storeIndex <- leftmostIndex - 1
  for i <- leftmostIndex + 1 to rightmostIndex
  if element[i] < pivotElement
    swap element[i] and element[storeIndex]
    storeIndex++
  swap pivotElement and element[storeIndex+1]
return storeIndex + 1
```



**Python**

```python
# Quick sort in Python


# Function to partition the array on the basis of pivot element
def partition(array, low, high):

    # Select the pivot element
    pivot = array[high]
    i = low - 1

    # Put the elements smaller than pivot on the left and greater 
    #than pivot on the right of pivot
    for j in range(low, high):
        if array[j] <= pivot:
            i = i + 1
            (array[i], array[j]) = (array[j], array[i])

    (array[i + 1], array[high]) = (array[high], array[i + 1])

    return i + 1


def quickSort(array, low, high):
    if low < high:

        # Select pivot position and put all the elements smaller 
        # than pivot on left and greater than pivot on right
        pi = partition(array, low, high)

        # Sort the elements on the left of pivot
        quickSort(array, low, pi - 1)

        # Sort the elements on the right of pivot
        quickSort(array, pi + 1, high)


data = [8, 7, 2, 1, 0, 9, 6]
size = len(data)
quickSort(data, 0, size - 1)
print('Sorted Array in Ascending Order:')
print(data)
```



**Java**

```java
// Quick sort in Java

import java.util.Arrays;

class QuickSort {

  // Function to partition the array on the basis of pivot element
  int partition(int array[], int low, int high) {
    
    // Select the pivot element
    int pivot = array[high];
    int i = (low - 1);

    // Put the elements smaller than pivot on the left and 
    // greater than pivot on the right of pivot
    for (int j = low; j < high; j++) {
      if (array[j] <= pivot) {
        i++;
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
    int temp = array[i + 1];
    array[i + 1] = array[high];
    array[high] = temp;
    return (i + 1);
  }

  void quickSort(int array[], int low, int high) {
    if (low < high) {

      // Select pivot position and put all the elements smaller 
      // than pivot on left and greater than pivot on right
      int pi = partition(array, low, high);
      
      // Sort the elements on the left of pivot
      quickSort(array, low, pi - 1);

      // Sort the elements on the right of pivot
      quickSort(array, pi + 1, high);
    }
  }

  // Driver code
  public static void main(String args[]) {
    int[] data = { 8, 7, 2, 1, 0, 9, 6 };
    int size = data.length;
    QuickSort qs = new QuickSort();
    qs.quickSort(data, 0, size - 1);
    System.out.println("Sorted Array in Ascending Order: ");
    System.out.println(Arrays.toString(data));
  }
}
```



**C**

```c
// Quick sort in C

#include <stdio.h>

// Function to swap position of elements
void swap(int *a, int *b) {
  int t = *a;
  *a = *b;
  *b = t;
}

// Function to partition the array on the basis of pivot element
int partition(int array[], int low, int high) {
  
  // Select the pivot element
  int pivot = array[high];
  int i = (low - 1);

  // Put the elements smaller than pivot on the left 
  // and greater than pivot on the right of pivot
  for (int j = low; j < high; j++) {
    if (array[j] <= pivot) {
      i++;
      swap(&array[i], &array[j]);
    }
  }

  swap(&array[i + 1], &array[high]);
  return (i + 1);
}

void quickSort(int array[], int low, int high) {
  if (low < high) {
    
    // Select pivot position and put all the elements smaller 
    // than pivot on left and greater than pivot on right
    int pi = partition(array, low, high);
    
    // Sort the elements on the left of pivot
    quickSort(array, low, pi - 1);
    
    // Sort the elements on the right of pivot
    quickSort(array, pi + 1, high);
  }
}

// Function to print eklements of an array
void printArray(int array[], int size) {
  for (int i = 0; i < size; ++i) {
    printf("%d  ", array[i]);
  }
  printf("\n");
}

// Driver code
int main() {
  int data[] = {8, 7, 2, 1, 0, 9, 6};
  int n = sizeof(data) / sizeof(data[0]);
  quickSort(data, 0, n - 1);
  printf("Sorted array in ascending order: \n");
  printArray(data, n);
}
```



### 复杂度

**时间复杂度**

- **最坏情况**：O(n^2^)

  拾取枢轴元素是最大或最小的元素，它发生。 这种情况导致枢轴元素位于已排序数组的最末端的情况。一个子数组始终为空，另一个子数组包含`n - 1`元素。因此，仅在此子阵列上调用quicksort。 但是，快速排序算法对于分散的数据透视表具有更好的性能。

  It occurs when the pivot element picked is either the greatest or the smallest element. This condition leads to the case in which the pivot element lies in an extreme end of the sorted array. One sub-array is always empty and another sub-array contains `n - 1` elements. Thus, quicksort is called only on this sub-array. However, the quick sort algorithm has better performance for scattered pivots.

- **最优情况**：`O(n*log n)`
  
  当枢轴元素始终是中间元素或靠近中间元素时，会发生这种情况。
  
  It occurs when the pivot element is always the middle element or near to the middle element.

- **平均情况**: `O(n*log n)`
  
  在不出现上述条件时发生。
  
  It occurs when the above conditions do not occur.

**空间复杂度**

快速排序的空间复杂度：`O(log n)`



### 应用场景

- 编程语言适合递归

  the programming language is good for recursion

- 时间复杂度很重要

  time complexity matters

- 空间复杂度很重要

  space complexity matters



## 参考

1. [Learn Data Structures and Algorithms](https://www.programiz.com/dsa/)

