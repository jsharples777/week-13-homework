"use strict";

var _Employee = require("../Employee");

var _Engineer = require("../Engineer");

describe('Engineer Test: constructing', function () {
  it("Should return an 'empty' Employee with an empty email, empty name, -1 for id, empty git hub name, and a role of Employee", function () {
    var employee = new _Engineer.Engineer();
    expect(employee.getId()).toBe(-1);
    expect(employee.getName()).toBe("");
    expect(employee.getEmail()).toBe("");
    expect(employee.getGitHubUsername()).toBe("");
    expect(employee.getRoleId()).toBe(_Employee.employeeTypes.Engineer);
  });
});
describe('Employee Test: setting attributes', function () {
  it("Set the attributes of an employee and check they are set properly", function () {
    var employee = new _Engineer.Engineer();
    employee.setEmail("test@test.com");
    employee.setId(1);
    employee.setName("Test Employee");
    expect(employee.getId()).toBe(1);
    expect(employee.getName()).toBe("Test Employee");
    expect(employee.getEmail()).toBe("test@test.com");
    expect(employee.getRoleId()).toBe(_Employee.employeeTypes.Engineer);
  });
});