const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const debug = require('debug')('db');

//create the connection to database
const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

let data = {
    departments: [],
    roles: [],
    employees: []
};




async function loadDatabase() {
    debug("Loading Departments...");
    const departmentRows = await connection.promise().query('select id,name from department order by id');
    data.departments = departmentRows[0];


    data.departments.forEach((row) => {
        debug(row);
    });

    debug("Loading Roles...");
    const roleRows = await connection.promise().query('select role.id,role.title,role.salary,role.department_id,department.name as "department" from role,department where role.department_id = department.id order by id');
    data.roles = roleRows[0];

    data.roles.forEach((row) => {
        debug(row);
    });

    debug("Loading Employees...");
    const employeeRows = await connection.promise().query('' +
        'select emp.id as "id", '+
        'emp.first_name as "firstname", ' +
        'emp.last_name as "lastname", ' +
        'role.title as "title", ' +
        'department.name as "department", ' +
        'role.salary as "salary", ' +
        'concat(manager.first_name," ",manager.last_name) as "manager", ' +
        'emp.manager_id, ' +
        'emp.role_id ' +
        'from ' +
        'employee emp, ' +
        'employee manager, ' +
        'role, ' +
        'department ' +
        'where ' +
        'manager.id = emp.manager_id and ' +
        'role.id = emp.role_id and ' +
        'department.id = role.department_id ' +
        'union ' +
        'select ' +
        'emp2.id, ' +
        'emp2.first_name, ' +
        'emp2.last_name, ' +
        'role2.title, ' +
        'department2.name, ' +
        'role2.salary, ' +
        '"", ' +
        'null, ' +
        'emp2.role_id ' +
        'from ' +
        'employee emp2, ' +
        'role role2, ' +
        'department department2 ' +
        'where ' +
        'emp2.manager_id is null and ' +
        'role2.id = emp2.role_id and ' +
        '   department2.id = role2.department_id ' +
        'order by 3,2');
    data.employees = employeeRows[0];

    data.employees.forEach((row) => {
        debug(row);
    });
}

async function dbUpdateEmployeeRole(answers) {
    // update the employee
    const sql = `update employee set role_id=${answers.role} where id = ${answers.employee}`;
    debug(sql);
    return await connection.promise().query(sql);
}

async function dbInsertEmployee(answers) {
    // insert the new employee
    const sql = `insert into employee (first_name,last_name,role_id,manager_id) values ('${answers.firstname}','${answers.lastname}',${answers.role},${answers.manager})`;
    debug(sql);
    return await connection.promise().query(sql);
}

async function dbInsertRole(answers) {
    // insert the new role
    const sql = `insert into role (title,salary,department_id) values ('${answers.title}',${answers.salary},${answers.department})`;
    debug(sql);
    return await connection.promise().query(sql);
}

async function dbInsertDepartment(name) {
    // insert the new department
    return await connection.promise().query(`insert into department (name) values ('${name}')`);
}

module.exports = {data, loadDatabase, dbUpdateEmployeeRole, dbInsertEmployee,dbInsertRole,dbInsertDepartment};