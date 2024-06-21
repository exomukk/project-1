# Auction Website Project

## Purpose:
This project aims to build an online auction platform where users can buy and sell products through online auction sessions.

## Key Features:
- User registration and profile management.
- Creating and managing auction sessions.
- Real-time bidding and auction status tracking.
- Payment processing and transaction management (under construction).

## Technologies Used:
- Frontend: JavaScript
- Backend: Java, Spring Boot
- Database: MS-SQL Server
- Build Tools: Maven
- Development Tools: Intellij IDEA, Visual Studio Code, Git

## Code Structure:
```
├───src
│   ├───main
│   │   ├───java
│   │   │   └───com
│   │   │       └───example
│   │   │           └───auctionwebsite
│   │   │               ├───controller
│   │   │               └───model
│   │   └───resources
│   │       └───static
│   │           └───assets
│   │               ├───css
│   │               ├───images
│   │               │   ├───icons
│   │               │   └───logo
│   │               └───js
│   └───test
│       └───java
│           └───com
│               └───example
│                   └───auctionwebsite
└───target
    ├───classes
    │   ├───com
    │   │   └───example
    │   │       └───auctionwebsite
    │   │           ├───controller
    │   │           └───model
    │   └───static
    │       └───assets
    │           ├───css
    │           ├───images
    │           │   ├───icons
    │           │   └───logo
    │           └───js
    └───generated-sources
        └───annotations
```

### How to run ?
- Clone this repository
- Run file `pom.xml`
- Run `docker-compose up`
- Run class `AuctiononlineApplication` in `./demo/src/main/java/com/example/demo` to run the backend
- Open localhost `http://localhost/-port-` to open the website

### Authors:
- Huy Trần
- Quân Ngô

### License:
This project is licensed under the MIT License - see the LICENSE.md file for details.

### Screenshot:
![screenshoot](./Screenshot%202024-06-08%20014425.png)
