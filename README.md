
# attendance-api


A simple backend API for KSM Android member attendance.  
This project is a final project as a member of Study Club Backend Basic KSM Android  
Veteran National Development University of Jakarta


## Prerequisite Software

- MySQL
- Node.js
- Apache2


## Installation

```bash
  git clone https://github.com/azcat01/attendance-api.git
  npm i bcrypt dotenv express knex mysql2
  npm i -D nodemon
```
    
## Setup Environment
create file .env in project directory and add the script below

```
NODE_ENV=development
PORT=3000

# DATABASE CONFIG
DB_USER="root"
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="attendance"
DB_PASSWORD=""
```
> Adjust the environment based on your mysql config

## Database

Turn on mysql and apache server and login to mysql
and write the script below

#### User Database
- create database
```
    CREATE DATABASE attendance;
    USE attendance;
```

- create tables
```
    CREATE TABLE `attendance`.`user` ( 
        `nim` VARCHAR(255) NOT NULL , 
        `firstName` VARCHAR(255) NOT NULL , 
        `lastName` VARCHAR(255) NOT NULL , 
        `angkatan` INT(5) NOT NULL , 
        `jurusan` VARCHAR(255) NOT NULL , 
        `email` VARCHAR(255) NOT NULL , 
        `password` VARCHAR(255) NOT NULL , 
        PRIMARY KEY (`nim`)) 
        ENGINE = InnoDB; 

    CREATE TABLE `attendance`.`test` ( 
        `nim` VARCHAR(255) NOT NULL , 
        `present` ENUM('off','late','present') NOT NULL , 
        `time` VARCHAR(255) NOT NULL , 
        PRIMARY KEY (`nim`)) 
        ENGINE = InnoDB; 

    ALTER TABLE `attendanceTable` 
    ADD FOREIGN KEY (`nim`) REFERENCES `user`(`nim`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE; 
```
## Usage/Examples

- Start the server
```javascript
npm run dev
```

- Create Account
```bash
curl --location --request POST 'http://localhost:3000/app/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "nim": "2110511065",
    "firstName": "Muhammad Irsyad",
    "lastName": "Abdurrahman",
    "angkatan": 2021,
    "jurusan": "Informatika",
    "email": "abc123@yahoo.co.id",
    "password": "asdasd123"
}'
```
- Get List Account
```bash
curl --location --request GET 'http://localhost:3000/app/account'
```

- Login
```bash
curl --location --request POST 'http://localhost:3000/app/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "abc123@yahoo.co.id",
    "password": "asdasd123"
}'
```

- Delete Account
```bash
curl --location --request DELETE 'http://localhost:3000/app/account' \
--header 'Content-Type: application/json' \
--data-raw '{
    "nim": "2110511062"
}'
```

- Present Attendance
```bash
curl --location --request PUT 'http://localhost:3000/app' \
--header 'Content-Type: application/json' \
--data-raw '{
    "nim": "2110511065",
    "present": "present"
}'
```

- Get Attendance
```bash
curl --location --request GET 'http://localhost:3000/app'
```

- Reset Attendance
```bash
curl --location --request POST 'http://localhost:3000/app/'
```
