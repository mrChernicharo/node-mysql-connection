use chat_app;


/***********************
	CREATE TABLES
************************/
create table users(
	id int auto_increment,
	name varchar(100) not null,
	email varchar(100) not null,
	created_at datetime default current_timestamp,

	constraint pk_users_id primary key (id)
);

create table rooms(
	id int auto_increment,
	name varchar(100) not null,
	created_at datetime default current_timestamp,

	constraint pk_rooms_id primary key (id)
);

create table messages(
	id int auto_increment,
	message text,
	user_id int,
	room_id int,
	created_at datetime default current_timestamp,

	constraint pk_messages_id primary key (id)
);

create table users_rooms(
	id int auto_increment,
	user_id int,
	room_id int,
	joined_at datetime default current_timestamp,

	constraint pk_users_rooms_id primary key (id)
);


/***********************
	FOREIGN KEYS
************************/

alter table messages add constraint fk_message_user
foreign key (user_id) references users(id);

alter table messages add constraint fk_message_room
foreign key (room_id) references rooms(id);

alter table users_rooms add constraint fk_users_rooms_user
foreign key (user_id) references users(id);

alter table users_rooms add constraint fk_users_rooms_room
foreign key (room_id) references rooms(id);



/***********************

************************/


