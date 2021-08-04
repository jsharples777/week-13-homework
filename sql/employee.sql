create table employee;

INSERT INTO cms.employee (id, first_name, last_name, role_id, manager_id) VALUES (1, 'Tony', 'Stark', 1, null);
INSERT INTO cms.employee (id, first_name, last_name, role_id, manager_id) VALUES (2, 'Dunce', 'Dunce', 2, 1);
INSERT INTO cms.employee (id, first_name, last_name, role_id, manager_id) VALUES (3, 'Steve', 'Rogers', 3, null);
INSERT INTO cms.employee (id, first_name, last_name, role_id, manager_id) VALUES (4, 'Natasha', 'Romanov', 3, 3);
INSERT INTO cms.employee (id, first_name, last_name, role_id, manager_id) VALUES (5, 'The', 'Falcon', 4, 4);
INSERT INTO cms.employee (id, first_name, last_name, role_id, manager_id) VALUES (6, 'The', 'Vision', 4, 4);
INSERT INTO cms.employee (id, first_name, last_name, role_id, manager_id) VALUES (7, 'Red', 'Witch', 4, 4);
INSERT INTO cms.employee (id, first_name, last_name, role_id, manager_id) VALUES (8, 'Peter', 'Parker', 5, 1);