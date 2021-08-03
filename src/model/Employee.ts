import Role from './Role';

export default class Employee {
    protected id: number;
    protected firstname: string;
    protected surname: string;
    protected email: string;
    protected managerId: number;
    protected employees: Employee[];
    protected role: Role|null;

    constructor() {
        this.email = "";
        this.id = -1;
        this.firstname = "";
        this.surname = "";
        this.managerId = -1;
        this.employees = [];
        this.role = null;
    }

    public setFirstName(name: string) {
        this.firstname = name;
    }

    public getFirstName(): string {
        return this.firstname;
    }

    public setSurname(name:string) {
        this.surname = name;
    }

    public getSurname():string {
        return this.surname;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number) {
        this.id = id;
    }


    public getManagerId():number {
        return this.managerId;
    }

    public setManagerId(id:number) {
        this.managerId = id;
    }

    public addEmployee(emp:Employee) {
        this.employees.push(emp);
    }

    public getEmployees():Employee[] {
        return this.employees;
    }

    public setRole(role:Role) {
        this.role = role;
    }

    public getRole() {
        return this.role;
    }

}
