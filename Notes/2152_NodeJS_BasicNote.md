# **Node.js**

## 1. Versions:
- Hiện tại gồm 18 versions.
- Version mới nhất: 18.6.0.
- Version LTS (Long-term Supported) mới nhất: 16.16.0.
- Mỗi phiên bản của Node.js sẽ cập nhật những bản vá lỗi và hỗ trợ. Ví dụ như bản Node.js 18.0 đã cập nhật thêm:
    - Experimental fetch API.
    - Web Streams API.
    - HTTP Timeouts.
    - Experimental test runner.
    - V8 JavaScript engine update v10.1.

## 2. Ưu nhược điểm:
| Ưu                                                                                          | Nhược                                                                                         |
|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Xử lý bất đồng bộ, Non-blocking IO giúp thời gian xử lý nhanh.                              | Không phù hợp với những ứng dụng tốn tài nguyên CPU.                                          |
| Dễ dàng mở rộng khi phát triển.                                                             | Không có nhiều hỗ trợ với những cơ sở dữ liệu quan hệ.                                        |
| Sử dụng duy nhất 1 ngôn ngữ (JavaScript) cho toàn bộ dự án.                                 | API không ổn định khi thay đổi phiên bản.                                                     |
| Hỗ trợ RESTful API.                                                                         | Bản thân Node.js không có nhiều thư viện hỗ trợ mạnh mẽ, hầu hết dựa vào thư viện bên thứ ba. |
| Kho thư viện phong phú phục vụ cho quá trình thực hiện dự án (NPM, Yarn).                   |                                                                                               |
| Mã nguồn mở, cộng đồng phát triển mạnh, dễ dàng tìm giải pháp cho những vấn đề trong dự án. |                                                                                               |
| Có nhiều frameworks hỗ trợ lập trình viên trong quá trình thực hiện dự án.                  |                                                                                               |

## 3. Những projects phù hợp với Node.js:
- Những dự án real-time (chat apps).
- Thương mại điện tử (e-commerce).
- Email sender.
- Single-page applications.
- Streaming applications.
- Những dự án với cấu trúc microservices.
</br>
(những dự án sử dụng RESTful API, dự án thời gian thực, streaming).

## 4. IDEs phổ biến:
- Visual Studio COde.
- Sublime Text.
- WebStorm.
- IntelliJ IDEA.  
Đây đều là những IDEs rất tốt khi làm việc với `Node.js` nói riêng và `JavaScript` nói chung với những chức năng: kết nối với Git, autocomplete, hệ thống các files trong project.

## 5. Môi trường phát triển, cài đặt và xây dựng ứng dụng đầu tiên:
- Node.js là môi trường mã nguồn mở, cross-platform, chạy trên V8 JavaScript engine của Google.
- Ta có thể cài Node.js từ trang chủ [https://nodejs.org](https://nodejs.org).
- Chạy lệnh ```node -v``` để kiểm tra phiên bản và kiểm tra xem Node.js đã được cài thành công chưa.
- Chạy một server Node.js cơ bản:
```js
    const http = require('http');
    const port = 3000;

    const server = http.createServer((req, res) => {
        res.end('Hello world');
    });

    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
```
- Server sử dụng HTTP module ```const http = require('http');``` để hoạt động và truyền dữ liệu qua giao thức HTTP.
- Sử dụng phương thức ```createServer()``` để tạo một HTTP server.

## 6. Cách debug và chạy ứng dụng:
### Debug:
- Node.js cung cấp tùy chọn ```inspect``` hỗ trợ việc debugging.
### Chạy ứng dụng:
- Sử dụng lệnh ```node tênfile.js``` để khởi động server.
- Server sẽ hoạt động trên hostname:port đã khai báo trong file chương trình.