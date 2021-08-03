import {employeeTypes} from "../Employee";
import {Engineer} from "../Engineer";

describe('Engineer Test: constructing', function () {
    it("Should return an 'empty' Employee with an empty email, empty name, -1 for id, empty git hub name, and a role of Employee",() => {
        let employee = new Engineer();
        expect(employee.getId()).toBe(-1);
        expect(employee.getName()).toBe("");
        expect(employee.getEmail()).toBe("");
        expect(employee.getGitHubUsername()).toBe("");
        expect(employee.getRoleId()).toBe(employeeTypes.Engineer);
    });
});

describe('Employee Test: setting attributes', function () {
    it("Set the attributes of an employee and check they are set properly",() => {
        let employee = new Engineer();
        employee.setEmail("test@test.com");
        employee.setId(1);
        employee.setName("Test Employee");
        expect(employee.getId()).toBe(1);
        expect(employee.getName()).toBe("Test Employee");
        expect(employee.getEmail()).toBe("test@test.com");
        expect(employee.getRoleId()).toBe(employeeTypes.Engineer);
    });
});