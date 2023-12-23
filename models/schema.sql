-- drop database correlation_db;
-- this the schema to create the databse
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



insert into admin_users (FName, Lname,email) values
('Saleh', 'Mohammed', 'saleh@hot.com'),
('Ali', 'khaled', 'Ali@hot.com');

insert into Users (FName, Lname,email,AdminID) values
('Saleh', 'Mohammed', 'saleh@hot.com',3),
('Ali', 'khaled', 'Ali@hot.com',1);


insert into correaltion_data(corrName,threshold,corrDateStart,corrDateEnd,ApiKey) values
('google ',0.9, CURDATE(),CURDATE(),'api/gogle/data'),
('youtube ',0.5, CURDATE(),CURDATE(),'api/youtube/data');



insert into detectedCorr(DataID,corrTimeStart,corrTimeEnd,corrType) values
( 1 , '8:22','8:23','postive'),
( 2 ,'3:12','3:14','no correlation');

