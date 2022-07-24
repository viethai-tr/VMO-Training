# **Strict mode:**
- Để sử dụng, thêm từ khóa "*use strict*" vào đầu hoặc thân của một function.
- Trong Strict Mode, không thể sử dụng biến nếu không khai báo bằng *var*, *let* hoặc *const*.
- Báo lỗi khi *delete* những thứ không thể xóa (biến, hàm, ...).
- Các tham số của hàm không được trùng nhau.
- Không sử dụng được cách viết số với tiền tố là 0.
## Tác dụng:
- Ngăn chặn sử dụng, throw errors khi thực hiện những xử lý **unsafe**.
- Vô hiệu hóa các tính năng có thể gây nhầm lẫn hoặc không nên sử dụng.
- Ngăn chặn sử dụng các từ có thể được sử dụng làm keywork trong tương lai.

# **Default parameter:**
- Gán cho các tham số một giá trị mặc định nếu không có giá trị nào được truyền vào hoặc giá trị tham số là *undefined*.

# **Destructuring:**
- Cú pháp giúp gán các giá trị trong mảng hoặc thuộc tính của đối tượng vào các biến riêng biệt.
### **VD:**
```ts
    let a, b;
    [a, b] = [10, 20];
    console.log(a); // 10
    console.log(b); // 20
```

# **Spread operator (...):**
- Dùng trong các thao tác với mảng (thêm phần tử vào mảng, kết hợp mảng hoặc object, truyền tham số mảng vào function).
```ts
    var params = [ "hello", true, 7 ];
    var other = [ 1, 2, ...params ]; // [1, 2, "hello", true, 7]
```

# **Template Literals, multi-line string:**
```ts
    var multiLine = `first
    second`;
    console.log(multiLine);
    /*
    first
    second
    */
```

# **Arrow function:**
```ts
    var welcome = (name, place) => {
        console.log(`Welcome ${name} to ${place}`);
    }

    welcome('Hai', 'VMO'); // Welcome Hai to VMO
```
### 1. Một tham số:
```ts
    var welcome = name => {
        console.log(`Welcome ${name} to VMO`);
    }

    welcome('Hai'); // Welcome Hai to VMO
```
### 2. Không có tham số:
```ts
    var welcome = () => {
        console.log(`Welcome Hai to VMO`);
    }

    welcome(); // Welcome Hai to VMO
```
### 3. Trường hợp nhiều tham số:
```ts
    var welcome = (name, place) => {
        console.log(`Welcome ${name} to ${place}`);
    }

    welcome('Hai', 'VMO'); // Welcome Hai to VMO
```
### 4. Sử dụng this trong arrow function:
- Trong function thông thường, từ khóa *this* sẽ đại diện cho object gọi đến function.
- Trong arrow function, từ khóa *this* đại diện cho object định nghĩa ra arrow function.

# **Class:**
- Một khái niệm hướng đối tượng, là một *template* để tạo ra các đối tượng.
- Cần hàm khởi tạo constructor khi sử dụng class.
### 1. Class declarations:
```ts
    class Rectangle {
        constructor(height, width) {
            this.height = height;
            this.width = width;
        }
    }
```
- Cần khai báo class trước khi sử dụng (khi hoisting, giá trị của class chưa được khởi tạo).
### 2. Class expressions:
```ts
    // unnamed
    let Rectangle = class {
        constructor(height, width) {
            this.height = height;
            this.width = width;
        }
    };
    console.log(Rectangle.name); // 'Rectangle'

    // named
    Rectangle = class Rectangle2 {
        constructor(height, width) {
            this.height = height;
            this.width = width;
        }
    };
    console.log(Rectangle.name); // 'Rectangle2'
```
## Tính kế thừa:
- Class con có thể kế thừa những thuộc tính, phương thức của class cha (sử dụng từ khóa *extends*).
- Nếu trong lớp con có phương thức trùng tên phương thức đã có của class cha, khi sử dụng sẽ mặc định sử dụng phương thức của lớp con.
- Để sử dụng phương thức của lớp cha, sử dụng từ khóa *super*.
- Hàm khởi tạo của lớp cha có tham số, trong hàm khởi tạo của lớp con phải gọi hàm khởi tạo của lớp cha bằng *super(...);*.