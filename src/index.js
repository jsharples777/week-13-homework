const inquirer = require('inquirer');
const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const debug = require('debug')('application');
const debugDB = require('debug')('database');
const debugInq = require('debug')('inquirer');
const cTable = require('console.table');

//create the connection to database
const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

let db = {
    departments: [],
    roles: [],
    employees: []
};

function ensureNotEmptyString(userInput) {
    let isEmpty = (userInput.trim().length === 0);
    if (isEmpty) {
        return `Value must be a non-empty string.`;
    }
    return true;
}

function onlyAllowNumbers(userInput) {
    return userInput.replace(/[^0-9]/g, '').trim();
}

function viewAllDepartments() {
    debug('View all departments');
    console.table(db.departments);
    mainLoop();
}

function viewRoles(roles) {
    debug('View roles');
    let roleDisplayItems = [];
    roles.forEach((role) => {
        let displayItem = {
            id:role.id,
            title:role.title,
            salary:role.salary,
            department:role.department
        }
        roleDisplayItems.push(displayItem);

    });
    console.table(roleDisplayItems);
    mainLoop();
}

function viewEmployees(employees) {
    debug('View employees');
    let empDisplayItems = [];
    employees.forEach((employee) => {
        let displayItem = {
            id:employee.id,
            firstname:employee.firstname,
            lastname: employee.lastname,
            title: employee.title,
            salary: employee.salary,
            department: employee.department,
            manager: employee.manager
        }
        roleDisplayItems.push(displayItem);

    });
    console.table(employees);
    mainLoop();
}

async function loadDatabase() {
    debugDB("Loading Departments...");
    const departmentRows = await connection.promise().query('select id,name from department order by id');
    db.departments = departmentRows[0];


    db.departments.forEach((row) => {
        debugDB(row);
    });

    debugDB("Loading Roles...");
    const roleRows = await connection.promise().query('select role.id,role.title,role.salary,role.department_id,department.name as "department" from role,department where role.department_id = department.id order by id');
    db.roles = roleRows[0];

    db.roles.forEach((row) => {
        debugDB(row);
    });

    debugDB("Loading Employees...");
    const employeeRows = await connection.promise().query('' +
    'select emp.id as "id", '+
        'emp.first_name as "firstname", ' +
        'emp.last_name as "lastname", ' +
        'role.title as "title", ' +
        'department.name as "department", ' +
        'role.salary as "salary", ' +
        'concat(manager.first_name," ",manager.last_name) as "manager", ' +
        'emp.manager_id, ' +
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
        '"" ' +
        'null ' +
    'from ' +
        'employee emp2, ' +
        'role role2, ' +
        'department department2 ' +
    'where ' +
        'emp2.manager_id is null and ' +
        'role2.id = emp2.role_id and ' +
    '   department2.id = role2.department_id ' +
    'order by 3,2');
    db.employees = employeeRows[0];

    db.employees.forEach((row) => {
        debugDB(row);
    });
}

async function addDepartment() {
    const questions = [
        {
            name: "name",
            type: "input",
            default: "Name",
            validate: ensureNotEmptyString
        }
    ];
    // get the name of the new department
    const answer = await inquirer.prompt(questions);
    debugInq(answer);
    // insert the new department
    const result = await connection.promise().query(`insert into department (name) values ('${answer.name}')`);
    debugDB(result);
    let newDepartment = {
        id: result[0].insertId,
        name: answer.name
    }
    debug(newDepartment);
    db.departments.push(newDepartment);
    mainLoop();
}

async function addRole() {



    const questions = [
        {
            name: "title",
            type: "input",
            default: "Name",
            validate: ensureNotEmptyString
        },
        {
            name: "salary",
            type: "input",
            default: "0",
            validate: ensureNotEmptyString,
            transformer: onlyAllowNumbers
        },
        {
            name: "department",
            type: "list",
            message: "Choose a department:",
            choices: convertDepartmentsToInquirerChoices(db.departments)
        }

    ];

    const answers = await inquirer.prompt(questions);
    debugInq(answers);

    // insert the new role
    const sql = `insert into role (title,salary,department_id) values ('${answers.title}',${answers.salary},${answers.department})`;
    debugDB(sql);
    const result = await connection.promise().query(sql);
    debugDB(result);
    // find the department name for the id
    const department = db.departments.find((department) => department.id == answers.department);
    // construct the new role in memory
    let newRole = {
        id: result[0].insertId,
        title: answers.title,
        salary: answers.salary,
        department: department.name
    }
    debug(newRole);
    // add the the new role into our role list
    db.roles.push(newRole);
    mainLoop();
}

function convertDepartmentsToInquirerChoices(departments) {
    let departmentChoices = [];
    departments.forEach((department) => {
        let departmentChoice = {
            name: department.name,
            value: department.id
        }
        departmentChoices.push(departmentChoice);
    });
    return departmentChoices;
}

function convertEmployeesToInquirerChoices(employees) {
    let choices = [];
    employees.forEach((employee) => {
        let choice = {
            name: employee.firstname + " " + employee.lastname,
            value: employee.id
        }
        choices.push(choice);
    });
    return choices;
}

function convertRolesToInquirerChoices(roles) {
    let roleChoices = [];
    roles.forEach((role) => {
        let roleChoice = {
            name: role.title,
            value: role.id
        }
        roleChoices.push(roleChoice);
    });
    return roleChoices;
}

async function addEmployee() {

    const questions = [
        {
            name: "firstname",
            type: "input",
            default: "First Name",
            validate: ensureNotEmptyString
        },
        {
            name: "lastname",
            type: "input",
            default: "Last Name",
            validate: ensureNotEmptyString
        },
        {
            name: "role",
            type: "list",
            message: "Choose a role:",
            choices: convertRolesToInquirerChoices(db.roles)
        },
        {
            name: "manager",
            type: "list",
            message: "Choose a manager:",
            choices: convertEmployeesToInquirerChoices(db.employees)
        }
    ];

    const answers = await inquirer.prompt(questions);
    debugInq(answers);

    // insert the new employee
    const sql = `insert into employee (first_name,last_name,role_id,manager_id) values ('${answers.firstname}','${answers.lastname}',${answers.role},${answers.manager})`;
    debugDB(sql);
    const result = await connection.promise().query(sql);
    debugDB(result);
    // find the role name for the id
    const role = db.roles.find((role) => role.id == answers.role);
    // find the department
    const department = db.departments.find((department) => department.id == role.department_id);
    // find the manager
    const manager = db.employees.find((manager) => manager.id == answers.manager);
    // construct the new role in memory

    let newEmployee = {
        id: result[0].insertId,
        firstname: answers.firstname,
        lastname: answers.lastname,
        title: role.title,
        department: department.name,
        salary:role.salary,
        manager:manager.firstname + " " + manager.lastname,
        manager_id:manager.id
    }
    debug(newEmployee);
    // add the the new role into our role list
    db.employees.push(newEmployee);
    mainLoop();

}

async function updateEmployeeRole() {
    // get the employees to select
    let questions = [
        {
            name: "employee",
            type: "list",
            message: "Choose an employee:",
            choices: convertEmployeesToInquirerChoices(db.employees)
        },
        {
            name: "role",
            type: "list",
            message: "Choose a role:",
            choices: convertRolesToInquirerChoices(db.roles)
        }
    ];

    const answers = await inquirer.prompt(questions);
    debugInq(answers);

    // update the employee
    const sql = `update employee set role_id=${answers.role} where id = ${answers.employee}`;
    debugDB(sql);
    const result = await connection.promise().query(sql);
    debugDB(result);
    // find the role name for the id
    const role = db.roles.find((role) => role.id == answers.role);
    // find the employee
    let employee = db.employees.find((employee) => employee.id == answers.employee);
    // update the new role in memory
    employee.title = role.title;
    employee.salary = role.salary;
    mainLoop();
}

async function viewEmployeesByManager() {
    // get the employees to select
    let questions = [
        {
            name: "manager",
            type: "list",
            message: "Choose an employee(manager):",
            choices: convertEmployeesToInquirerChoices(db.employees)
        }
    ];

    const answer = await inquirer.prompt(questions);
    // filter the employees by manager
    let employeesForManager = [];
    db.employees.forEach((employee) => {
        if (employee.manager_id == answer.manager) {
            employeesForManager.push(employee);
        }
    });
    viewEmployees(employeesForManager);

    mainLoop();
}

async function viewEmployeesByDepartment() {
    // get the employees to select
    let questions = [
        {
            name: "department",
            type: "list",
            message: "Choose a Department:",
            choices: convertDepartmentsToInquirerChoices(db.departments)
        }
    ];

    const answer = await inquirer.prompt(questions);
    // filter the employees by department
    let employeesForManager = [];
    db.employees.forEach((employee) => {
        if (employee.manager_id == answer.manager) {
            employeesForManager.push(employee);
        }
    });
    viewEmployees(employeesForManager);

    mainLoop();
}


async function showMainMenu() {
    let menuQuestions = [
        {
            name: "mainmenu",
            type: "list",
            message: "What you like to do:",
            choices: [
                {
                    name: "View All Departments",
                    value: "show-departments"
                },
                {
                    name: "View All Roles",
                    value: "show-roles"
                },
                {
                    name: "View All Employees",
                    value: "show-employees"
                },
                {
                    name: "View employees by manager",
                    value: "view-employees-by-manager"
                },
                {
                    name: "View employees by department",
                    value: "view-employees-by-department"
                },
                {
                    name: "Add a Department",
                    value: "add-department"
                },
                {
                    name: "Add a Role",
                    value: "add-role"
                },
                {
                    name: "Add an Employee",
                    value: "add-employee"
                },
                {
                    name: "Update Employee Role",
                    value: "update-employee-role"
                },
                {
                    name: "Exit Application",
                    value: "exit"
                }
            ],
        }

    ];

    return await inquirer.prompt(menuQuestions);
}



async function mainLoop() {
    const menu = await showMainMenu();
    debug(menu);

    switch (menu.mainmenu) {
        case "show-departments": {
            viewAllDepartments();
            break;
        }
        case "show-roles": {
            viewRoles(db.roles);
            break;
        }
        case "show-employees": {
            viewEmployees(db.employees);
            break;
        }
        case "add-department": {
            addDepartment();
            break;
        }
        case "add-role": {
            addRole();
            break;
        }
        case "add-employee": {
            addEmployee();
            break;
        }
        case "update-employee-role": {
            updateEmployeeRole();
            break;
        }
        case "view-employees-by-manager": {
            viewEmployeesByManager();
            break;
        }
        case "view-employees-by-department": {
            viewEmployeesByDepartment();
            break;
        }
        case "exit": {
            process.exit(0);
            break;
        }
    }

}

async function main() {
    await loadDatabase();
    await mainLoop();
}

main();



