const debug = require('debug')('view');
const cTable = require('console.table');

function view(items) {
    console.table(items);
}

function viewDepartments(departments) {
    debug('View all departments');
    view(departments);
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
    view(roleDisplayItems);
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
        empDisplayItems.push(displayItem);

    });
    view(empDisplayItems);
}

module.exports = {view,viewDepartments,viewEmployees,viewRoles};
