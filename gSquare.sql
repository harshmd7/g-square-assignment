create table student(
id serial primary key,
name varchar(150),
email varchar(150),
age int,
course varchar(150)
)

insert into student 
values 
(1,'harsh','harsh@gmail.com',21,'BE'),
(2,'shlok','shlok@gmail.com',21,'BE'),
(3,'krishna','krishna@gmail.com',21,'MBA');

select * from student;
select * from student as s where s.course = 'BE';

update student set course='MBA' where id = 2;

delete from student where id = 2;