"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Role = /*#__PURE__*/function () {
  function Role() {
    _classCallCheck(this, Role);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "title", void 0);

    _defineProperty(this, "salary", void 0);

    _defineProperty(this, "departmentId", void 0);

    _defineProperty(this, "employees", void 0);

    _defineProperty(this, "department", void 0);

    this.id = -1;
    this.title = "";
    this.salary = 0.0;
    this.departmentId = -1;
    this.employees = [];
    this.department = null;
  }

  _createClass(Role, [{
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }, {
    key: "setId",
    value: function setId(id) {
      this.id = id;
    }
  }, {
    key: "getTitle",
    value: function getTitle() {
      return this.title;
    }
  }, {
    key: "setTitle",
    value: function setTitle(title) {
      this.title = title;
    }
  }, {
    key: "getSalary",
    value: function getSalary() {
      return this.salary;
    }
  }, {
    key: "setSalary",
    value: function setSalary(salary) {
      this.salary = salary;
    }
  }, {
    key: "getDepartmentId",
    value: function getDepartmentId() {
      return this.departmentId;
    }
  }, {
    key: "setDepartmentId",
    value: function setDepartmentId(id) {
      this.departmentId = id;
    }
  }, {
    key: "addEmployee",
    value: function addEmployee(emp) {
      this.employees.push(emp);
    }
  }, {
    key: "getEmployees",
    value: function getEmployees() {
      return this.employees;
    }
  }, {
    key: "getDepartment",
    value: function getDepartment() {
      return this.department;
    }
  }, {
    key: "setDepartment",
    value: function setDepartment(department) {
      this.department = department;
    }
  }]);

  return Role;
}();

exports["default"] = Role;