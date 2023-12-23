drop database correlation_db;
create database correlation_db;
USE correlation_db;

create table Admin_Users(
ID integer PRIMARY KEY AUTO_INCREMENT,
FName varchar(50),
Lname varchar(50),
email varchar(100),
created TIMESTAMP NOT NULL DEFAULT NOW()
);
create table Users(
ID integer PRIMARY KEY AUTO_INCREMENT,
AdminID integer,
FOREIGN KEY(AdminID) REFERENCES Admin_Users(ID) ON UPDATE CASCADE,
FName varchar(50),
Lname varchar(50),
email varchar(100),
created TIMESTAMP NOT NULL DEFAULT NOW()
);
create table correaltion_data (
corrID integer primary key AUTO_INCREMENT,
corrName varchar(50),
threshold float4,
corrDateStart Date not null,
corrDateEnd Date not null,
NoOfCorr integer default 0,
ApiKey  varchar(255)
);
create table detectedCorr (
detecID integer primary key AUTO_INCREMENT,
DataID integer not null,
foreign key(DataID) references correaltion_data(corrID)ON DELETE CASCADE ON UPDATE CASCADE,
corrType varchar(20),
corrTimeStart time not null,
corrTimeEnd time not null
);


