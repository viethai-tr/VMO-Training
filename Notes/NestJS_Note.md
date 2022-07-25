- chia module theo feature.

## **Module:**
- Đóng gói logic các chức năng cần triển khai.
- Là class được define với ```@Module()```.

## **Controller:**
- Xử lý các request và trả về response cho ng dùng.
- Mỗi controller sẽ chứa các router thực hiện các hành động khác nhau.

## **Service:**
- Xử lý logic: kết nối db, sửa field...

<!-- ## **Provider:**
- Cung cấp các service, repository,... cho controller trong một module sử dụng. -->

controller: nhận request => gọi function trong service
service trả kết quả => controller => client

# **Prisma:**
- Prisma client: class cho phép kết nối với db.
- Prisma Migrate: 