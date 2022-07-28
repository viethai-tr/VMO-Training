- chia module theo feature.
- IoC.
- Lifecycle (request lifecycle).
- Dependency Injection.

## **Module:**
- Controller luôn thuộc về một module.
- Đóng gói logic các chức năng cần triển khai.
- Là class được define với ```@Module()```.
- ```@Module()``` nhận một Object gồm những thuộc tính.
    - **providers**.
    - **controllers**.
    - **imports**.
    - **exports**.

## **Controller:**
- Xử lý các request và trả về response cho ng dùng.
- Quy định các route path (```/auth/signup/```, ```/auth/signin/```...);
- **Routing** kiểm soát việc **controller** nào nhận request nào.
- Có thể sử dụng regex (```?```, ```+```, ```*```) để mô tả pattern route (wildcard).

## **Providers:**
- Là một khái niệm cơ bản trong NestJS.
- Nhiều class của Nest được coi là Providers: services, repositories, factories,...
- Provider là một class được liên kết với decorator ```@Injectable()```.

## **DTO:**
- Ràng buộc kiểu dữ liệu gửi lên.

## **Service:**
- Xử lý logic của controller.

controller: nhận request => gọi function trong service
service trả kết quả => controller => client

service =(used by)=> controller => module => app module

## **Middleware:** (provider)
- Là function được gọi trước route handler.
- Implement ```NestMiddleware``` interface.
- Consumer 
> ```.apply() .forRoute({ path:, method: })```, 
>
> ```.exclude({ path:, method: })```.

## **Pipes:**
- Validate dữ liệu + Parse.

## **Guards:**
- Nhiệm vụ: quyết định xem 1 request sẽ được route handler xử lý hay không.
> (phân quyền, permission).
- Implement ```canActivate()``` function.
- Middlewares => Guards => Interceptors => Pipes => Interceptors => Exception filters. 