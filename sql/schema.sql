create table department (
    id int unsigned primary key auto_increment,
    name varchar(30)
);

create table role(
                     id int unsigned primary key auto_increment,
                     title varchar(30),
                     salary decimal(10,0),
                     department_id int unsigned,
                     foreign key (department_id) references department(id) on delete cascade
);

create table employee (
    id int unsigned primary key auto_increment,
    first_name varchar(30),
    last_name varchar(30),
    role_id int unsigned,
    manager_id int unsigned,
    foreign key (role_id) references role(id) on delete set null,
    foreign key (manager_id) references employee(id) on delete set null
);


