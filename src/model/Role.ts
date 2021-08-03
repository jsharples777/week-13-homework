import Employee from "./Employee";
import Department from "./Department";

export default class Role {
    protected id:number;
    protected title:string;
    protected salary:number;
    protected departmentId:number;
    protected employees:Employee[];
    protected department:Department|null;

    constructor() {
        this.id = -1;
        this.title = "";
        this.salary = 0.0;
        this.departmentId = -1;
        this.employees = [];
        this.department = null;
    }

    public getId():number {
        return this.id;
    }

    public setId(id:number) {
        this.id = id;
    }

    public getTitle():string {
        return this.title;
    }

    public setTitle(title:string) {
        this.title = title;
    }

    public getSalary():number {
        return this.salary;
    }

    public setSalary(salary:number) {
        this.salary = salary;
    }

    public getDepartmentId():number {
        return this.departmentId;
    }

    public setDepartmentId(id:number) {
        this.departmentId = id;
    }

    public addEmployee(emp:Employee) {
        this.employees.push(emp);
    }

    public getEmployees() {
        return this.employees;
    }

    public getDepartment():Department|null {
        return this.department;
    }

    public setDepartment(department:Department) {
        this.department = department;
    }




}