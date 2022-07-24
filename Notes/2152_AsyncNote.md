# **ASYNCHRONOUS**

## **Callback:**
- Một hàm được gọi là callback nếu hàm đó được truyền vào dưới dạng đối số của một hàm khác.
```js
    function greeting(name) {
        alert('Hello ' + name);
    }

    function processUserInput(callback) {
        var name = prompt('Please enter your name.');
        callback(name);
    }

    processUserInput(greeting);
```
## **Promise:**
- Promise sinh ra để giải quyết callback hell (có quá nhiều callback, dẫn đến code không đẹp, khó đọc).
- Gồm có 3 trạng thái: `Pending`, `Fulfilled`, `Rejected`.
```js
    let myPromise = new Promise(function(myResolve, myReject) {
      myResolve();
      myReject();
    });

    myPromise
        .then(value)
        .catch (error);
```
- Promise chain:
```js
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(10);
        }, 3 * 100);
    });

    p.then((result) => {
        console.log(result);
        return result * 2;
    }).then((result) => {
        console.log(result);
        return result * 3;
    });
```

## **Async, await:**
- Được xây dựng dựa trên `Promise`.
- `Async`: tự động chuyển function thành `Promise()`.
- `Await`: sử dụng với `Async`, hoạt động với `Promise`, tạm dừng các chức năng không đồng bộ.
```js
    const verifyUser = async function(username, password) {
        try {
            const userInfo = await database.verifyUser(username, password);
            const rolesInfo = await database.getRoles(userInfo);
            const logStatus = await database.logAccess(userInfo);
        } catch (e) {
            // handle errors
        }
    }
```
- Nếu chức năng sau hoạt động không cần dựa vào dữ liệu của chức năng trước, sử dụng `Promise.all()` thay cho `await` (`Promise.all()` thực hiện song song. `await` thực hiện tuần tự).