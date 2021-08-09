const inquirer = require('inquirer');
const debug = require('debug')('application');
const debugInq = require('debug')('inquirer');
const dotenv = require('dotenv').config();


const {
    showMainMenu,
    convertRolesToInquirerChoices,
    convertEmployeesToInquirerChoices,
    convertDepartmentsToInquirerChoices,
    onlyAllowNumbers,
    ensureNotEmptyString} = require("./inquirerFns");

const {
    view,
    viewDepartments,
    viewRoles,
    viewEmployees
} = require('./viewdataFns');

const {
    data,
    loadDatabase,
    dbUpdateEmployeeRole,
    dbInsertEmployee,
    dbInsertRole,
    dbInsertDepartment
} = require('./db');



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
    const result = await dbInsertDepartment(answer.name);
    debug(result);
    let newDepartment = {
        id: result[0].insertId,
        name: answer.name
    }
    debug(newDepartment);
    data.departments.push(newDepartment);
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
            choices: convertDepartmentsToInquirerChoices(data.departments)
        }

    ];

    const answers = await inquirer.prompt(questions);
    debugInq(answers);

    const result = await dbInsertRole(answers);
    debug(result);
    // find the department name for the id
    const department = data.departments.find((department) => department.id == answers.department);
    // construct the new role in memory
    let newRole = {
        id: result[0].insertId,
        title: answers.title,
        salary: answers.salary,
        department: department.name,
        department_id: department.id
    }
    debug(newRole);
    // add the the new role into our role list
    data.roles.push(newRole);
    mainLoop();
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
            choices: convertRolesToInquirerChoices(data.roles)
        },
        {
            name: "manager",
            type: "list",
            message: "Choose a manager:",
            choices: convertEmployeesToInquirerChoices(data.employees,true)
        }
    ];

    const answers = await inquirer.prompt(questions);
    debugInq(answers);
    const result = await dbInsertEmployee(answers);
    debug(result);
    // find the role name for the id
    const role = data.roles.find((role) => role.id == answers.role);
    // find the department
    const department = data.departments.find((department) => department.id == role.department_id);
    // find the manager
    let manager = {
        firstname:"",
        lastname:"",
        id:null
    };
    if (answers.manager != null) manager = data.employees.find((manager) => manager.id == answers.manager)
    // construct the new role in memory
    let newEmployee = {
        id: result[0].insertId,
        firstname: answers.firstname,
        lastname: answers.lastname,
        title: role.title,
        department: department.name,
        salary:role.salary,
        manager:manager.firstname + " " + manager.lastname,
        manager_id:manager.id,
        role_id:role.id,
    }
    debug(newEmployee);
    // add the the new role into our role list
    data.employees.push(newEmployee);
    mainLoop();

}

async function updateEmployeeRole() {
    // get the employees to select
    let questions = [
        {
            name: "employee",
            type: "list",
            message: "Choose an employee:",
            choices: convertEmployeesToInquirerChoices(data.employees)
        },
        {
            name: "role",
            type: "list",
            message: "Choose a role:",
            choices: convertRolesToInquirerChoices(data.roles)
        }
    ];

    const answers = await inquirer.prompt(questions);
    debugInq(answers);
    const result = await dbUpdateEmployeeRole(answers);
    debug(result);
    // find the role name for the id
    const role = data.roles.find((role) => role.id == answers.role);
    // find the employee
    let employee = data.employees.find((employee) => employee.id == answers.employee);
    // update the new role in memory
    employee.title = role.title;
    employee.salary = role.salary;
    employee.role_id = role.id;
    mainLoop();
}

async function viewEmployeesByManager() {
    // get the employees to select
    let questions = [
        {
            name: "manager",
            type: "list",
            message: "Choose an employee(manager):",
            choices: convertEmployeesToInquirerChoices(data.employees)
        }
    ];

    const answer = await inquirer.prompt(questions);

    // filter the employees by manager
    let employeesForManager = [];
    data.employees.forEach((employee) => {
        if (employee.manager_id === answer.manager) {
            employeesForManager.push(employee);
        }
    });
    viewEmployees(employeesForManager);

    mainLoop();
}

function findEmployeesForDepartment(department, roles, employees) {
    let employeesForDepartment = [];
    roles.forEach((role) => {
        if (role.department_id == department.id) {
            employees.forEach((employee) => {
               if (employee.role_id == role.id) {
                   employeesForDepartment.push(employee);
               }
            });
        }
    });
    return employeesForDepartment;
}

function calculateForDepartment(department, roles, employees) {
    let budget = 0;
    roles.forEach((role) => {
        if (role.department_id == department.id) {
            employees.forEach((employee) => {
                if (employee.role_id == role.id) {
                    budget += parseInt(employee.salary);
                }
            });
        }
    });
    return budget;
}

async function viewEmployeesByDepartment() {
    // get the employees to select
    let questions = [
        {
            name: "department",
            type: "list",
            message: "Choose a Department:",
            choices: convertDepartmentsToInquirerChoices(data.departments)
        }
    ];

    const answer = await inquirer.prompt(questions);
    // find the department
    const department = data.departments.find((department) => department.id == answer.department);
    // filter the employees by department by going through the roles first
    let employeesForDepartment = findEmployeesForDepartment(department,data.roles,data.employees);
    viewEmployees(employeesForDepartment);
    mainLoop();
}

async function viewBudgetByDepartment() {
    let displayItems = [];
    // for each department
    data.departments.forEach((department) => {
        let displayItem = {
            id: department.id,
            name: department.name,
            budget: calculateForDepartment(department,data.roles, data.employees)
        }
        displayItems.push(displayItem);

    });
    view(displayItems);

}





async function mainLoop() {
    const menu = await showMainMenu();

    switch (menu.mainmenu) {
        case "show-departments": {
            viewDepartments(data.departments);
            mainLoop();
            break;
        }
        case "show-roles": {
            viewRoles(data.roles);
            mainLoop();
            break;
        }
        case "show-employees": {
            viewEmployees(data.employees);
            mainLoop();
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
        case "view-budget-by-department": {
            viewBudgetByDepartment();
            mainLoop();
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



