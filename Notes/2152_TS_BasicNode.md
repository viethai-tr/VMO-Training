# **Interface:**
- **Interface** là cách để định nghĩa một cấu trúc. Bất cứ Class nào khi sử dụng phải tuân thủ các biến và phương thức có trong **Interface**.
### VD:
```ts
    interface Person {
        firstName: string;
        lastName: string;
    }

    function welcome(person: Person) {
        return 'Welcome, ' + person.firstName + " " + person.lastName;
    }
```
## 1. Interface vs. Type:
| Giống nhau                                                 | Khác nhau                                                      |
|------------------------------------------------------------|----------------------------------------------------------------|
| - Đều có thể extends và implements từ Interface và Type.  | - Một class không thể implements Type nếu Type sử dụng Union.  |
|                                                            | - Một Interface không thể extends Type nếu Type sử dụng Union. |
|                                                            | - Không thể sử dụng Merge với Type.                            |

## 2. Built-in Type primitives:
| Tên       | Ví dụ                                                                                 |
|-----------|---------------------------------------------------------------------------------------|
| string    | let str = 'Welcome'                                                                   |
| number    | let num = 5                                                                           |
| boolean   | let bool = false                                                                      |
| null      | let value = null                                                                      |
| undefined | const shirt = {name: 'T Shirt', color: 'White'} console.log(shirt.price) // undefined |
| symbol    | let symbol1 = Symbol("abc");                                                                                      |
| object    | const shirt = {name: 'T Shirt', color: 'White'}     

## 3. Common built-in JS Object:
### 3.1. Any:
- Kiểu dữ liệu đặc biệt, được sử dụng khi bạn không chắc chắn về kiểu dữ liệu của biến.
```ts
    let x: any;
```
- Sau khi gán kiểu dữ liệu **any** cho biến, ta có thể gọi nó như một function, gán cho nó một dữ liệu thuộc bất kỳ loại nào.
```ts
    x = 100;
    x = 'hello';
    x();
```
### 3.2. Unknown:
- Giống với kiểu dữ liệu `any`, nhưng an toàn hơn vì ta không thể thao tác gì với những biến có kiểu giá trị **unknown**.
- Phù hợp để sử dụng cho kiểu dữ liệu function. Ta có thể dùng type **unknown** cho những function nhận tất cả giá trị mà không cần **any** trong thân function.
```ts
    function safeParse(s: string): unknown {
        return JSON.parse(s);
    }

    const obj = safeParse(someRandomString);
```

## 4. Generics:
- Với những interface, class khai báo bằng **Generics**, ta có thể tái sử dụng với nhiều kiểu dữ liệu khác nhau.
```ts
    function identity<Type>(arg: Type): Type {
        return arg;
    }

    let outputString = identity<string>("myString");
    console.log(outputString); // 'myString'

    let outputNum = identity<number>(5);
    console.log(outputNum); // 5
```
- Generics với Interface:
```ts
    interface GenericIdentityFn {
        <Type>(arg: Type): Type;
    }
    
    function identity<Type>(arg: Type): Type {
        return arg;
    }
    
    let myIdentity: GenericIdentityFn<number> = identity;
```

## 5. Overloads:
- Overloading (nạp chồng phương thức): sử dụng nhiều function có cùng tên nhưng khác kiểu tham số và kiểu trả về.
```ts
    function  add(a:string, b:string):string;

    function  add(a:number, b:number):  number;

    function  add(a:  any, b:any):  any {
        return  a  +  b;
    }

    add("Hello ", "Steve"); // returns "Hello Steve"

    add(10, 20); // returns 30
```
### Quy tắc:
- Tên hàm phải giống nhau.
- Cùng số lượng đối số.
- Kiểu dữ liệu của đối số và kết quá trả về khác nhau.

## 6. Get, set:
- Getter và setter trong TypeScript khá giống JavaScript.
```ts
    class C {
        _length = 0;
        get length() {
            return this._length;
        }
        set length(value) {
            this._length = value;
        }
    }
```
- Sử dụng `getter` và `setter` sẽ che dấu được tên thuộc tính và validate được đầu vào.

## 7. Extension via merging:
- Declaration Merging: cho phép gộp các Namespace, Type, Value lại với nhau khi chúng trùng tên.
- Đơn giản và phổ biến nhất: merging interface.
```ts
    interface  Box {
        height:  number;
        width:  number;
    }

    interface  Box {
        scale:  number;
    }

    let box:  Box = { height:  5, width:  6, scale:  10 };
```

## 8. Class conformance:
- Class sẽ gồm các phần như constructor, thuộc tính, phương thức.
```ts
    class Point {
        x: number;
        y: number;
    
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        sum() : number {
            return this.x + this.y;
        }
    }
```
- Constructor: sẽ được gọi khi ta tạo đối tượng, được khai báo bằng từ khóa `constructor`:
```ts
    class Employee {

        empCode: number;
        empName: string;
        // class có thể không cần contructor . có thể tùy chỉnh ở file tsconfig
        constructor(empcode: number, name: string ) {
            this.empCode = empcode;
            this.name = name;
        }
    }
```
- Tạo một đối tượng mới từ Class: sử dụng toán tử `new`:
```ts
    let newEmp = new Employee(123, 'Hai');
```

# **Type:**
## 1. Object literal type:
- Là một list các cặp `tên: giá trị` được phân cách nhau bởi dấu phẩy.
### 1.1. Định nghĩa Object literal với `No type`:
```ts
    let user = {
        id: 123,
        name: 'VH',
        email: 'vh@gmail.com'
    }

    console.log(user.name) // 'VH'

    console.log(user.age) // Error
```
- Khi định nghĩa với `No type`, ta sẽ gặp lỗi khi truy cập những giá trị không tồn tại.

### 1.2. Định nghĩa Object literal với `any`:
```ts
    let user:any = {
        id: 123,
        name: 'VH',
        email: 'vh@gmail.com'
    }

    console.log(user.name); // 'VH'
    console.log(user.age); // undefined

    user.age = 23;
    console.log(user.age); // 23
```

### 1.3. Định nghĩa với type Record:
```ts
    let user:Record<string, string> = {
        name: 'Hai',
        email: 'vh@gmail.com'
    }

    console.log(user.name); // Hai
```

### 1.4. Định nghĩa với type tự chọn:
```ts
    let user:{id: number, name: string, email: string} = {
        id: 123,
        name: 'V',
        email: 'vv@gmail.com'
    }

    console.log(user.id) // 123
    console.log(user.number) // Property 'number' does not exist

    user.age = 19;
    console.log(user.age) // Property 'age' does not exist
```

### 1.5. Định nghĩa với interface:
```ts
    interface userType {
        id: number,
        name: string,
        email: string,
        age?: number
    }

    let user1: userType = {
        id: 10,
        name: 'User1',
        email: 'user1@gmail.com',
    }

    let user2: userType = {
        id: 11,
        name: 'User2',
        email: 'user2@gmail.com',
        age: 18
    }
```

## 2. Tuple type:
### Tuple là một kiểu dữ liệu, hoạt động như mảng với một số đặc điểm:
- Số phần tử của mảng là cố định.
- Kiểu dữ liệu của các phần tử đã biết.
</br>
**=> Cần khai báo số lượng phần tử và kiểu dữ liệu trước khi sử dụng.**
```ts
    let tuple: [number, string, boolean] = [7, "hello", true];
    let [a, b, c] = tuple; // a: number, b: string, c: boolean;

    console.log(a); // 7
```
- Sẽ gặp lỗi nếu số phần tử của mảng lớn hơn số phần tử đã khai báo của `tuple`.
```ts
    let tuple: [number, string, boolean] = [7, "hello", true];
    let [a, b, c, d] = tuple; // Error, no element at index 3
```
- Giống như mảng, ta có thể sử dụng `spread operator` với `tuple`.
```ts
    let tuple: [number, string, boolean] = [7, "hello", true];
    let [a, ...bc] = tuple; // bc: [string, boolean]
    let [a, b, c, ...d] = tuple; // d: [], the empty tuple
```
- Thêm phần tử vào `tuple` giống như mảng.
```ts
    var employee: [number, string] = [1, "Steve"];
    employee.push(2, "Bill"); 
    console.log(employee); // [1, 'Steve', 2, 'Bill']
```

## 3. Union type:
- `Union` là kiểu dữ liệu cho phép sử dụng nhiều hơn một kiểu dữ liệu cho một biến hoặc một đối số hàm.
- `Union` giúp tiết kiệm thời gian kiểm tra kiểu dữ liệu đối với các tham số có nhiều hơn một kiểu dữ liệu.
- Ví dụ tham số có kiểu dữ liệu là một số hoặc một chuỗi:
```ts
    function padLeft(value: string, padding: string | number) {
		console.log(value + padding);
    }

    padLeft(1,2);
```
- Nếu một trong những kiểu dữ liệu có thuộc tính riêng thì cần kiểm tra kiểu dữ liệu trước khi gọi.
```ts
    interface Bird {
        fly(): void;
        layEggs(): void;
    }

    interface Fish {
        swim(): void;
        layEggs(): void;
    }

    declare function getSmallPet(): Fish | Bird;

    let pet = getSmallPet();

    pet.layEggs();
    // Only available in one of the two possible types
    pet.swim();
```

## 4. Intersection type:
- `Intersection` cho phép chúng ta tạo một kiểu dữ liệu mới bằng các `extend` các kiểu dữ liệu đã có.
```ts
    interface Colorful {
        color: string;
    }
    interface Circle {
        radius: number;
    }
 
    type ColorfulCircle = Colorful & Circle;

    function draw(newCircle: ColorfulCircle) {
        console.log(`Color was ${circle.color}`);
        console.log(`Radius was ${circle.radius}`);
    }
 
    draw({ color: "blue", radius: 42 });
```
- Thứ tự type không quan trọng khi kết hợp trong `Intersection`.

## 5. Type indexing:
- Trong TS, ta có thể tham chiếu đến một thuộc tính trong `type` khác bằng cú pháp:
```ts
    type Foo = {
        a: string;
        b: number;
        1: null;
    }

    type A = Foo["a"]; //string 
    type B = Foo["b"]; //number
    type ObjOne = Foo[1]; //null;
```
```ts
    type MyArray = [string, number, string];

    type Zero = MyArray[0]; //string 
    type One = MyArray[1]; //number
```

## 6. Mapped type:
- Một `variable` có thể sử dụng type của `type` hoặc `interface` khác cho chính bản thân nó.
```ts
    type  OnlyBoolsAndHorses = {
        [key: string]: boolean | Horse;
    };

    const  conforms: OnlyBoolsAndHorses = {
        del:  true,
        rodney:  false,
    };
```
- `Mapped type` kết hợp với `Generic`:
```ts
    type  OptionsFlags<Type> = {
        [Property  in  keyof  Type]: boolean;
    };
```
`OptionsFlags` sẽ lấy tất cả thuộc tính từ kiểu `Type` và thay đổi giá trị của chúng thành boolean.
```ts
    type FeatureFlags = {
        darkMode: () => void;
        newUserProfile: () => void;
    };
 
    type FeatureOptions = OptionsFlags<FeatureFlags>;
```

### Mapping Modifiers:
- Có hai công cụ sửa đổi có thể được áp dụng trong quá trình mapping: `readonly` và `?`.
- Ta có thể xóa hoặc thêm những công cụ sửa đổi này với tiền tố `-` hoặc `+`. Nếu không có tiền tố, mặc định sẽ là `+`.
```ts
    // Removes 'readonly' attributes from a type's properties
    type CreateMutable<Type> = {
        -readonly [Property in keyof Type]: Type[Property];
    };
    
    type LockedAccount = {
        readonly id: string;
        readonly name: string;
    };
    
    type UnlockedAccount = CreateMutable<LockedAccount>;
```
```ts
    // Removes 'optional' attributes from a type's properties
    type Concrete<Type> = {
        [Property in keyof Type]-?: Type[Property];
    };
    
    type MaybeUser = {
        id: string;
        name?: string;
        age?: number;
    };
    
    type User = Concrete<MaybeUser>;
```

## 7. Conditional type:
- Trong hầu hết các chương trình, chúng ta phải đưa ra quyết định dựa trên input. Trong JS, những quyết định đó có thể đưa ra dựa vào `types` của input.
- Conditional types giúp mô tả mối quan hệ giữa `types` của input và output.
```ts
    interface Animal {
        live(): void;
    }
    interface Dog extends Animal {
        woof(): void;
    }
 
    type Example1 = Dog extends Animal ? number : string; // number
 
    type Example2 = RegExp extends Animal ? number : string; // string
```
- `Conditional types` có dạng giống như biểu thức điều kiện trong JavaScript.
```ts
    SomeType extends OtherType ? TrueType : FalseType;
```
### Error handling example:
- Giả sử ta có hai loại lỗi trong ứng dụng:
1) Lỗi ứng dụng.
2) Lỗi JavaScript thông thường.
```ts
    abstract class ApplicationError {
        abstract status: number;
        abstract message: string;
    }
```
```ts
    class ServerError extends ApplicationError {
        status = 500;
        constructor(public message: string) {
            super();
        }
    }
```
- Ta tạo một `Conditional type` để xác định loại lỗi:
```ts
    type ErrorType<T extends {error: ApplicationError | Error}> = T['error'] extends ApplicationError ? ApplicationError : Error;
```

## 8. Utility types:
### Partial:
- `Partial` chuyển tất cả các thuộc tính trong object thành `optional`.
```ts
    interface Point {
        x: number;
        y: number;
    }

    let pointPart: Partial<Point> = {}; // `Partial` allows x and y to be optional
    pointPart.x = 10;
```
### Required:
- `Required` chuyển tất cả các thuộc tính trong object thành bắt buộc.
```ts
    interface Car {
        make: string;
        model: string;
        mileage?: number;
    }

    let myCar: Required<Car> = {
        make: 'Ford',
        model: 'Focus',
        mileage: 12000 // `Required` forces mileage to be defined
    };
```
### Record:
- `Record` giúp định nghĩa một object với loại dữ liệu cụ thể của `key` và `value`.
```ts
    const nameAgeMap: Record<string, number> = {
        'Alice': 21,
        'Bob': 25
    };
```
- ```Record<string, number>``` sẽ tương tự như ```{ [key: string]: number }```.

# **Class:**
## 1. Generic classes:
- Tương tự như `Generic interface`, `Generic classes` có danh sách các tham số Generic type (<>) sau têm class.
```ts
    class GenericNumber<NumType> {
        zeroValue: NumType;
        add: (x: NumType, y: NumType) => NumType;
    }
 
    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function (x, y) {
        return x + y;
    };
```
## 2. Public, protected, private:
- **Public:** các thuộc tính và phương thức public có thể truy cập từ bất cứ đâu, trong và ngoài class đều được.
```ts
    class Employee {
        public empCode: string;
        empName: string;
    }

    let emp = new Employee();
    emp.empCode = 123;
    emp.empName = "Swati";
```
- **Protected:** các thuộc tính và phương thức chỉ truy cập được bên trong class và class con của nó.
```ts
    class Employee {
        private empCode: number;
        empName: string;
    }

    let emp = new Employee();
    emp.empCode = 123; // Error
    emp.empName = "Swati"; //OK
```
- **Private:** các thuộc tính và phương thức chỉ truy cập được bên trong class đó.
```ts
    class Employee {
        public empName: string;
        protected empCode: number;

        constructor(name: string, code: number){
            this.empName = name;
            this.empCode = code;
        }
    }

    class SalesEmployee extends Employee{
        private department: string;
        
        constructor(name: string, code: number, department: string) {
            super(name, code);
            this.department = department;
        }
    }

    let emp = new SalesEmployee("John Smith", 123, "Sales");
    empObj.empCode; // Error
```

## 3. Static:
- Những đối tượng `static` của một class được truy cập theo cú pháp
```
    <ClassName>.<StaticMember>
```
- Không thể truy cập đối tượng `static` qua các `instance` của Class, chỉ có thể truy cập qua ClassName hoặc những phương thức `static` trong class đó.

