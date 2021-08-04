const inquirer = require('inquirer');

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

function convertEmployeesToInquirerChoices(employees,addEmptyEmployee = false) {
    let choices = [];
    if (addEmptyEmployee) {
        let choice = {
            name: "(None)",
            value: null
        }
        choices.push(choice);
    }
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
                    name: "View total budget by department",
                    value: "view-budget-by-department"
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


module.exports = {showMainMenu,convertDepartmentsToInquirerChoices, convertEmployeesToInquirerChoices, convertRolesToInquirerChoices, onlyAllowNumbers, ensureNotEmptyString}