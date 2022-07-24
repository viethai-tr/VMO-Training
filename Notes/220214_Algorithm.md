- Data struct: json, xml
- Big O
- Array 
  + Simple sorting (bubble, selection, insertion)"
- Stack/Queue
- Linked list
- Recursion 
  + Ha noi tower problem
  + Merge sort"
- Quick sort
- Binary tree
 + Binary search tree
  + BFS, DFS"
- Hash table
  + Hash function"
- Database: sql
 + Các kiểu câu lệnh query,  optimize query, đánh index, tạo view."
# I. My  Outline
## 1. Part 1
- Big O

- Array 
  - Simple sorting (bubble, selection, insertion)

- Stack/Queue

- Linked list

- Recursion 
  - Ha noi tower problem
  - Merge sort

## 2. Part 2
- Quick sort

- Binary tree
  - Binary search tree
  - BFS, DFS

- Hash table
  - Hash function

# II. Content
## 1. Big O

- Wiki:
  ```
  Big O notation is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity
  ```
- Big O notation describes the complexity/performance of your code (algorithm) using algebraic terms.
 
- Time complexity:
  - Example with code:
    - O(1), O(2), O(3) --> O(1): constant
    - O(n), O(n+2), O(2n), O(n+m) --> O(n): linear
    - O(n^2): quadratic
    - O(log n): logarithmic
    - O(2^n): exponential
  
  - ...
  
  ![alt text](./img/bigO.png)

- Space complexity:
  - Number of `memories` that the Algorithm used
  - 

## 2. Array
- [Complexity of array method in JS](https://dev.to/lukocastillo/time-complexity-big-0-for-javascript-array-methods-and-examples-mlg)

-> Implement sort algorithm

### a. Selection sort
### b. Bubble sort
### c. Insertion sort
-> This is most useful when there is a scenario wherein you are receiving a series of numbers in real time, and need them in a sorted array.

==> 3 sorting algorithm above:
- Time complexity of O(n²)
- Space complexity of O(1)

## 3. Stack / Queue
- Stack: LIFO
```js
const stack = [];
// push
stack.push(1);
// pop
stack.pop();
```
- Queue: FIFO
```js
const queue = [];
// enqueue O(1)
queue.push(1);

// dequeue: O(n)
queue.shift();
```

## 5. Linked list
![alt text](./img//linked_list.png);
## 6. Recursion
- Problem: Ha noi's Tower
![alt text](./img//hanoi_tower.png)
# III. Summary

## Other Ref:
- https://www.freecodecamp.org/news/big-o-notation-why-it-matters-and-why-it-doesnt-1674cfa8a23c/

- https://medium.com/@rajat_m/implement-5-sorting-algorithms-using-javascript-63c5a917e811

- https://www.geeksforgeeks.org/c-program-for-tower-of-hanoi/

- https://visualgo.net/en/sorting?slide=1