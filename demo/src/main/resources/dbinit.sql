create table [user] (
    user_id NVARCHAR(50) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL,
    email NVARCHAR(50) NOT NULL,
    password NVARCHAR(50) NOT NULL,
    name NVARCHAR(100) NOT NULL,
    phonenumber INTEGER
);

create table [admin] (
    user_id NVARCHAR(50) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL,
    password NVARCHAR(50) NOT NULL
);

create table [items] (
    item_id INTEGER,
    name NVARCHAR(50),
    detail NVARCHAR(50),
);
