# **PROJECTS MANAGEMENT**
## **Overview:**
### Introduction:
- This project is aim at providing easy-to-use API endpoints to manage projects and related entities (Employees, Departments, Customers, etc).

### Objectives:
- Allow administrators, users to manage projects (status, members, technologies, etc).
- Allow administrators to modify projects.
- Allow administrators to manage, add, remove users.

## Technologies:
- NestJS.
- MongoDB.

## Installation:
Clone repo of the project to your device by 
```
git clone https://github.com/viethai-tr/VMO-Training
cd project-management
npm install
```

## Updates:
- [x] Validating input in DTOs.
- [x] Updating using PATCH.
- [x] Soft deleting.
- [x] Checking Manager exists in Department documents and checking Customer exists in Project documents.
- [x] Sending email to active users.
- [ ] Login with Google.
- [x] Upload files.
    - [x] Upload files to Cloudinary (13/9).
    - [ ] Remove, update files from Cloudinary.
    - [ ] Handle errors with file field.

## Testing: [Coverage](https://drive.google.com/file/d/1ZtZrSo6GNnh-b3cnDMdOew2hKVjZxwgn/view?usp=sharing).
- [x] Customer.
- [x] Department.