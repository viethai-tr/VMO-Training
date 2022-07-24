# **Variable:**
- containers for storing data (storing data values).
- Always declare JavaScript variables with var, let, const.

# **Scope:**
## Global scope:
- Biến khai báo bên ngoài function.
- Có thể truy cập từ bất kỳ đâu trong chương trình.
- **var**, **let**, **const** khi khai báo bên ngoài block đều là **Global scope**.
## Block scope:
- Biến được khai báo bên trong block {}.
- Biến khai báo với từ khoá **var** vẫn truy cập được bên ngoài block.
- Biến khai báo với **let**, **const** không thể truy cập từ ngoài block.
## Function scope:
- Mỗi function sẽ tạo 1 scope mới.
- Tất cả biến **var**, **let**, **const** ko thể truy cập bên ngoài function.

# **Loop:**
- **For:** lặp khối code một số lần nhất định.
- **For in:** lặp qua các key của một Object.
- **For of:** lặp qua các value của Object (thường dùng cho mảng).
- **While:** lặp khi điều kiện được cho đúng.
- **Do while:** lặp 1 lần, sau đó lặp khi điều kiện dc cho đúng.

# **Function:**
## Function declaretion (*function myFunction() {}*):
- Được hoisted, có thể gọi đến trước khi khai báo hàm.
## Function expression (*var a = function(n1, n2)*):
- Không được hoisted, không thể gọi khi chưa khai báo.

# **Comparison and Logical Operators:**
## Comparison operators:
- **==**: so sánh giá trị (true khi giá trị bằng nhau).
- **===**: true khi cả giá trị và kiểu dữ liệu giống nhau.
- **!=**: true khi 2 giá trị không bằng nhau.
- **!==**: true khi giá trị hoặc kiểu dữ liệu không giống nhau.
- **>**, **>=**: lớn hơn, lớn hơn hoặc bằng.
- **<**, **<=**: nhỏ hơn, nhỏ hơn hoặc bằng.
## Logical operators:
- **&&**, **||**, **!**: và, hoặc, phủ định.

# **Condition:**
- **If:** những câu lệnh trong khối lệnh If sẽ được chạy nếu thoả mãn điều kiện.
- **Else:** những câu lệnh trong khối lệnh Else sẽ được chạy nếu điều kiện khối lệnh If không thoả mãn.
- **Else if:** điều kiện của khối lệnh Else if sẽ được kiểm tra nếu điều kiện của khối lệnh trước không thoả mãn.
- **Switch:** khối lệnh có giá trị biểu thức truyền vào bằng giá trị biểu thức của mệnh đề case sẽ được chạy.

# **This:**
- Để chỉ một Object.
- Tuỳ theo cách gọi, **this** sẽ chỉ đến các loại Object khác nhau.
- **This** không hoạt động trong arrow function.

# **Operators:**
- Cộng, trừ, nhân, chia, luỹ thừa, chia lấy phần dư (+, -, *, /, **, %).
- ++: tăng giá trị lên 1.
- --: giảm giá trị xuống 1.
- ++x, --x: tăng hoặc giảm giá trị trước khi thực hiện các phép toán khác trong cùng 1 câu lệnh.
- x++, x--: tăng hoặc giảm giá trị sau khi thực hiện các phép toán khác trong cùng 1 câu lệnh.

#  **Block code:**
- Được đánh dấu bằng cặp dấu {}.
- Thường được sử dụng với *while, if...else, for*.
- Biến *let* và *const* không thể truy cập được ngoài block code đã khai báo.