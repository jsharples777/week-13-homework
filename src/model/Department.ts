import Role from "./Role";

export default class Department {
    protected id:number;
    protected name:string;
    protected roles:Role[];

    constructor() {
        this.id = -1;
        this.name = "";
        this.roles = [];
    }

    public getId() {
        return this.id;
    }

    public setId(id:number) {
        this.id = id;
    }

    public getName() {
        return this.name;
    }

    public setName(name:string) {
        this.name = name;
    }

    public addRole(role:Role) {
        this.roles.push(role);
    }

    public getRoles() {
        return this.roles;
    }

}