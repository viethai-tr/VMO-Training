# `Node.js is single-threaded`

# Non-blocking IO:
- Những công việc liên quan đến IO không thể ngăn chặn những công việc khác.
- Trong lúc chờ đợi kết quả của yêu cầu, đoạn mã đằng sau vẫn tiếp tục được thực thi mà không cần đợi dữ liệu trả về.

</br>

# Event loop:
- Giúp Node.js có thể chạy non-blocking IO.
- Là một vòng lặp vô tận, chờ đợi để nhận và thực hiện các tasks và events.
- Xử lý những việc cần thực thi trong `call stack`, đến khi `call stack` rỗng => `event queue`.


</br>

# Lifecycle: