export class EmailAlreadyExist extends Error {
    constructor() {
        super(`Email already exist`);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
    }
}