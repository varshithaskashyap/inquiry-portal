drop database if exists inquiry_portal;
create database inquiry_portal;
use inquiry_portal;

create table users
	(
		acc_id int auto_increment primary key,
		username varchar(255) unique not null,
        email varchar(30) default "I'd Rather Not Say",
		position varchar(30) not null,
		password varchar(255) not null,
		created_at timestamp default now()	
	);

insert into users(username,email,position,password,created_at)
	values
		("visitor1","me@example.com","Visitor","$2b$10$ZCBOLOQMRjSTEO/2IMisSuvVxUdfm5ewuTulUPOXopEYOqBk.qiYi","2021-04-13 17:12:20"),
		("agent1","me@example.com","Agent","$2b$10$/u6cmynRpGsPvC6rQ35FYOybiMnMi4fxA8JLtqkpHuvldMy19s0m.","2021-04-13 17:45:24"),
		("visitor2","me@example.com","Visitor","$2b$10$ZCBOLOQMRjSTEO/2IMisSuvVxUdfm5ewuTulUPOXopEYOqBk.qiYi","2021-04-13 17:12:20"),
		("agent2","me@example.com","Agent","$2b$10$/u6cmynRpGsPvC6rQ35FYOybiMnMi4fxA8JLtqkpHuvldMy19s0m.","2021-04-13 17:45:24");


create table chats
	(
		chat_id int auto_increment primary key,
		from_id int not null,
		to_id int not null,
		text varchar(255) not null,
		created_at timestamp default now(),
		
		foreign key(from_id) references users(acc_id) on delete cascade,
		foreign key(to_id) references users(acc_id) on delete cascade
	)