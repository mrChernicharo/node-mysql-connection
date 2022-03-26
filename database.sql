-- create/delete/truncate tables
-- constraints
-- insert some data
-- triggers
-- check data
-- special queries

-- drop-create database


create database chat_app;

use chat_app;

-- create tables
create table `user`(
    id int auto_increment,
    `nickname` varchar(60) not null,
    created_at datetime,
    
    constraint pk_user_id primary key(id)
);
create table room(
    id int auto_increment,
    `name` varchar(60) not null,
    created_at datetime,
    
    constraint pk_room_id primary key(id)
);
-- user 1:n messages | room 1:n messages
create table message(
    id int auto_increment,
    `text` text not null,
    created_at datetime,
    fk_user_id int not null,
    fk_room_id int not null,
    
    constraint pk_message_id primary key(id)
);
-- user n:n room
create table user_room (
    id int auto_increment,
    fk_user_id int not null,
    fk_room_id int not null,
    joined_at datetime not null,
    
    constraint pk_user_room_id primary key(id)
);
-- n:n
create table contact(
	id int auto_increment,
    fk_user_a int not null,
    fk_user_b int not null,
    
    constraint pk_contact_id primary key (id)
);

show tables;
-- constraints

alter table message
add constraint fk_message_user_id foreign key(fk_user_id) references `user`(id);

alter table message
add constraint fk_message_room_id foreign key(fk_room_id) references room(id);

alter table user_room
add constraint fk_user_room_user_id foreign key(fk_user_id) references `user`(id);

alter table user_room
add constraint fk_user_room_room_id foreign key(fk_room_id) references room(id);

alter table contact 
add constraint fk_user_a_id foreign key (fk_user_a) references `user`(id);

alter table contact 
add constraint fk_user_b_id foreign key (fk_user_b) references `user`(id);


-- check data


desc `user`;
desc room;
desc message;
desc user_room;
desc contact;

-- insert some data

insert into `user`(nickname, created_at) values 
    ('Felipe', current_timestamp),
    ('Mari', addtime(current_timestamp, '00:10:000001')),
    ('Edna', addtime(current_timestamp, '00:14:000001')),
    ('Gabriel',addtime(current_timestamp, '01:20:000001')),
    ('Mike Campbel', addtime(current_timestamp, '01:30:00')),
    ('Pancho Amat', addtime(current_timestamp, '03:50:00'));


insert into room(`name`, created_at) values
    ('Family', addtime(current_timestamp, '01:20:000001')),
    ('CPII', addtime(current_timestamp, '01:30:00')),
    ('Professional', addtime(current_timestamp, '01:50:00'));


insert into user_room (fk_user_id, fk_room_id, joined_at) values
(1, 1, addtime(current_timestamp, '00:20:00')), -- Felipe => Familia
(2, 1, addtime(current_timestamp, '00:24:00')), -- Mari => Familia
(3, 1, addtime(current_timestamp, '00:22:00')), -- Edna => Familia
(1, 2, addtime(current_timestamp, '00:23:00')), -- Felipe => CPII
(2, 2, addtime(current_timestamp, '00:21:00')), -- Mari => CPII
(4, 2, addtime(current_timestamp, '00:25:00')), -- Gabriel => CPII
(6, 2, addtime(current_timestamp, '00:26:00')), -- Pancho => CPII
(1, 3, addtime(current_timestamp, '00:27:00')), -- Felipe => Professional
(5, 3, addtime(current_timestamp, '00:28:00')); -- Mike Campbell => Professional


insert into `message`(`text`, created_at, fk_user_id, fk_room_id) values
    ('Oi familia!', addtime(current_timestamp, '00:20:000001'),1, 1), -- felipe / familia
    ('Bom dia!', addtime(current_timestamp, '00:21:10'), 3, 1), -- edna
    ('Bom dia pessoal!', addtime(current_timestamp, '00:23:29'), 2, 1), -- mari
    ('Q q vcs tão planejando pra hoje?', addtime(current_timestamp, '00:40:14'), 3, 1), -- edna
    ('Acho q vamos a praia', addtime(current_timestamp, '00:45:45'), 2, 1), -- Mari
    ('Partiu dona Edna?', addtime(current_timestamp, '00:45:45'), 2, 1), -- Felipe
    ('Opa! Partiu!', addtime(current_timestamp, '00:46:10'), 3, 1), -- edna
    
    ('Pedro II tudo ou nada? 🌱', addtime(current_timestamp, '01:31:20'), 4, 2), -- gabriel / cp2
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
select * from room;
select * from message;
select * from user_room;
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

show triggers;



-- check data


desc `user`;
desc room;
desc message;
desc user_room;
desc contact;

select * from `user`;
select * from room;
select * from message;
select * from user_room;
select * from contact;

show triggers;


-- [special queries]

-- pegar todas as mensages da sala
select id as id_msg,
	(select `name` from room where id = 2) as room,
    (select `nickname` from `user` where id = fk_user_id) as `user`, 
    `text`, created_at
from message
where fk_room_id = 2
order by created_at asc;

-- pegar todas as mensages do usuário
select id as id_msg, `text`,
    (select `nickname` from `user` where id = 1) as `user`, 
    (select `name` from room where id = fk_room_id) as room
from message
where fk_user_id = 1;

-- pegar todas as salas de um usuário
select id as relationID, 
	(select `nickname` from `user` where id = fk_user_id) as `user`,
    joined_at,
	(select `name` from room where id = fk_room_id) as room,
    (select created_at from room where id = fk_room_id) as room_created_at
from user_room
where fk_user_id = 1;


-- pegar todos os usuários de uma sala
select id as relationID,
	(select `nickname` from user where id = fk_user_id) as `user`,
    joined_at,
	(select `name` from `room` where id = fk_room_id) as room,
    (select created_at from `room` where id = fk_room_id) as room_created_at
from user_room
where fk_room_id = 2;


-- pegar todos os usuários de todas as salas
select id as relationID,
	(select `nickname` from `user` where id = fk_user_id) as `user`,
    joined_at,
	(select `name` from room where id = fk_room_id) as room,
    (select created_at from room where id = fk_room_id) as room_created_at
from user_room
order by `user`;



select ur.id as item, r.id as room_id, r.`name` as room, u.id as user_id, u.nickname as `user` 
from user_room as ur
left join user as u
on u.id = ur.fk_user_id
left join room as r
on r.id = ur.fk_room_id
where u.id = 1;


-- kill stuff

truncate `user`;
truncate room;
truncate `message`;
truncate user_room;
truncate contact;

-- subtraindo 10 horas do horário de criação de todas as salas
update room set created_at = subtime(created_at, '10:00:00');

drop database chat_app;