-- create/delete/truncate tables
-- constraints
-- insert some data
-- triggers
-- check data
-- special queries

-- drop-create database


create database zchat;

use zchat;

-- create tables
create table `user`(
    id int auto_increment,
    `nickname` varchar(60) not null,
	email varchar(80) not null,
	avatar_url varchar(255), 
    created_at datetime,
    
    constraint pk_user_id primary key(id)
);
create table chat(
    id int auto_increment,
    `name` varchar(60) not null,
	img_url varchar(255), 
    created_at datetime,
    
    constraint pk_chat_id primary key(id)
);
-- 1:1
-- create table chat_last_message(
-- 	id int auto_increment,
-- 	message int default null

-- 	constraint pk_chat_last_message_id primary key(id)
-- )
-- user n:n chat
create table user_chat (
    id int auto_increment,
    fk_user_id int not null,
    fk_chat_id int not null,
    joined_at datetime not null,
    
    constraint pk_user_chat_id primary key(id)
);
-- n:n
create table contact(
	id int auto_increment,
    fk_user_a int not null,
    fk_user_b int not null,
    
    constraint pk_contact_id primary key (id)
);
-- user 1:n messages | chat 1:n messages
create table message(
    id int auto_increment,
    `text` text not null,
    created_at datetime,
    fk_user_id int not null,
    fk_chat_id int not null,
    
    constraint pk_message_id primary key(id)
);

show tables;
-- constraints

alter table message
add constraint fk_message_user_id foreign key(fk_user_id) references `user`(id);

alter table message
add constraint fk_message_chat_id foreign key(fk_chat_id) references chat(id);

alter table chat_last_message
add constraint fk_chat_last_message_id foreign key(fk_chat_id) references chat(id);

alter table user_chat
add constraint fk_user_chat_user_id foreign key(fk_user_id) references `user`(id);

alter table user_chat
add constraint fk_user_chat_chat_id foreign key(fk_chat_id) references chat(id);

alter table contact 
add constraint fk_user_a_id foreign key (fk_user_a) references `user`(id);

alter table contact 
add constraint fk_user_b_id foreign key (fk_user_b) references `user`(id);


-- check data


desc `user`;
desc chat;
desc message;
desc user_chat;
desc contact;

-- insert some data

insert into `user`(nickname, created_at) values 
    ('Felipe', current_timestamp),
    ('Mari', addtime(current_timestamp, '00:10:000001')),
    ('Edna', addtime(current_timestamp, '00:14:000001')),
    ('Gabriel',addtime(current_timestamp, '01:20:000001')),
    ('Mike Campbel', addtime(current_timestamp, '01:30:00')),
    ('Pancho Amat', addtime(current_timestamp, '03:50:00'));


insert into chat(`name`, created_at) values
    ('Family', addtime(current_timestamp, '01:20:000001')),
    ('CPII', addtime(current_timestamp, '01:30:00')),
    ('Professional', addtime(current_timestamp, '01:50:00'));


insert into user_chat (fk_user_id, fk_chat_id, joined_at) values
(1, 1, addtime(current_timestamp, '00:20:00')), -- Felipe => Familia
(2, 1, addtime(current_timestamp, '00:24:00')), -- Mari => Familia
(3, 1, addtime(current_timestamp, '00:22:00')), -- Edna => Familia
(1, 2, addtime(current_timestamp, '00:23:00')), -- Felipe => CPII
(2, 2, addtime(current_timestamp, '00:21:00')), -- Mari => CPII
(4, 2, addtime(current_timestamp, '00:25:00')), -- Gabriel => CPII
(6, 2, addtime(current_timestamp, '00:26:00')), -- Pancho => CPII
(1, 3, addtime(current_timestamp, '00:27:00')), -- Felipe => Professional
(5, 3, addtime(current_timestamp, '00:28:00')); -- Mike Campbell => Professional


insert into message(`text`, created_at, fk_user_id, fk_chat_id) values
    ('Oi familia!', addtime(current_timestamp, '00:20:000001'),1, 1), -- felipe / familia
    ('Bom dia!', addtime(current_timestamp, '00:21:10'), 3, 1), -- edna
    ('Bom dia pessoal!', addtime(current_timestamp, '00:23:29'), 2, 1), -- mari
    ('Q q vcs tão planejando pra hoje?', addtime(current_timestamp, '00:40:14'), 3, 1), -- edna
    ('Acho q vamos a praia', addtime(current_timestamp, '00:45:45'), 2, 1), -- Mari
    ('Partiu dona Edna?', addtime(current_timestamp, '00:45:45'), 2, 1), -- Felipe
    ('Opa! Partiu!', addtime(current_timestamp, '00:46:10'), 3, 1), -- edna
    
    ('Pedro II tudo ou nada?', addtime(current_timestamp, '01:31:20'), 4, 2), -- gabriel / cp2
    ('Tudo!', addtime(current_timestamp, '01:31:50'), 1, 2), -- felipe
    ('Então como é que é?', addtime(current_timestamp, '01:32:20'), 6, 2), -- pancho
    ('3 X 7 🥳', addtime(current_timestamp, '01:35:20'), 4, 2), -- gabriel
    ('Zum zum zum!', addtime(current_timestamp, '01:37:04'),2, 2), -- mari
    
    ('Que é isso meu?', addtime(current_timestamp, '02:32:30'), 1, 3), -- felipe / profissional
    ('Um puuulta case de sucesso', addtime(current_timestamp, '02:32:54'), 1, 3), -- felipe
    ('Most certainly!', addtime(current_timestamp, '02:40:14'), 5, 3);  -- mike
    

insert into contact (fk_user_a, fk_user_b) values 
(1, 2), -- Felipe / Mari
(3, 1), -- Edna / Felipe
(3, 4), -- Edna / Gabriel
(3, 5), -- Edna / Mike
(3, 6), -- Edna / Pancho
(6, 1), -- Pancho / Felipe
(4, 6), -- Gabriel / Pancho
(4, 1), -- Gabriel / Felipe
(5, 1), -- Felipe / Mike
(6, 2); -- Pancho / Mari



select * from `user`;
select * from chat;
select * from message;
select * from user_chat;
select * from contact;
-- triggers

-- OLHA A TRIGGER AIH GENTE!
-- with this, we're preventing redundant entries by blocking contact creation
-- if there's an existing entry for the given id pair in the table
delimiter $$
create trigger tr_before_insert_contact
	before insert on contact
	for each row
begin
	-- checking if a contact (a connection) exists
	if (
		select count(*) from contact
		where 
		(fk_user_a = new.fk_user_a and fk_user_b = new.fk_user_b)
		or 
		(fk_user_a = new.fk_user_b and fk_user_b = new.fk_user_a)
	) > 0 then
    -- if connection exists, throw an error
	signal sqlstate '45000';
	end if;
end$$
delimiter ;

-- 
-- delimiter $$
-- create trigger tr_after_insert_contact
-- 	after insert on contact
-- 	for each row
-- begin

-- end$$
-- delimiter ;
-- 
show triggers;



-- check data


desc `user`;
desc chat;
desc message;
desc user_chat;
desc contact;

select * from `user`;
select * from chat;
select * from message;
select * from user_chat;
select * from contact;

show triggers;


-- [special queries]

-- pegar todas as mensages da sala
select id as id_msg,
	(select `name` from chat where id = 2) as chat,
    (select `nickname` from `user` where id = fk_user_id) as `user`, 
    `text`, created_at
from message
where fk_chat_id = 2
order by created_at asc;

-- pegar todas as mensages do usuário
select id as id_msg, `text`,
    (select `nickname` from `user` where id = 1) as `user`, 
    (select `name` from chat where id = fk_chat_id) as chat
from message
where fk_user_id = 1;

-- pegar todas as salas de um usuário
select id as relationID, 
	(select `nickname` from `user` where id = fk_user_id) as `user`,
    joined_at,
	(select `name` from chat where id = fk_chat_id) as chat,
    (select created_at from chat where id = fk_chat_id) as chat_created_at
from user_chat
where fk_user_id = 1;


-- pegar todos os usuários de uma sala
select id as relationID,
	(select `nickname` from user where id = fk_user_id) as `user`,
    joined_at,
	(select `name` from `chat` where id = fk_chat_id) as chat,
    (select created_at from `chat` where id = fk_chat_id) as chat_created_at
from user_chat
where fk_chat_id = 2;


-- pegar todos os usuários de todas as salas
select id as relationID,
	(select `nickname` from `user` where id = fk_user_id) as `user`,
    joined_at,
	(select `name` from chat where id = fk_chat_id) as chat,
    (select created_at from chat where id = fk_chat_id) as chat_created_at
from user_chat
order by `user`;


-- get all chats from a user
select ur.id as item, r.id as chat_id, r.`name` as chat, u.id as user_id, u.nickname as `user` 
from user_chat as ur
left join user as u
on u.id = ur.fk_user_id
left join chat as r
on r.id = ur.fk_chat_id
where u.id = 1;

-- -----------------------------------
-- get chat data
select id as chat_id, name as chat_name, created_at from chat where id = 1;
-- get users data
select id,
	(select `nickname` from user where id = fk_user_id) as `user`,
    joined_at
from user_chat
where fk_chat_id = 1;
-- get messages
select id as id_msg,
    (select `nickname` from `user` where id = fk_user_id) as `user`, 
    `text`, 
    created_at as `sent_at`
from message
where fk_chat_id = 1
order by created_at asc;




-- kill stuff
set foreign_key_checks = 0;
set foreign_key_checks = 1;

truncate `user`;
truncate chat;
truncate `message`;
truncate user_chat;
truncate contact;

select * from chat;

set foreign_key_checks = 1;

-- subtraindo 10 horas do horário de criação de todas as salas
update chat set created_at = subtime(created_at, '10:00:00');

drop database zchat;