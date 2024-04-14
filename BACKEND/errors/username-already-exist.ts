export class UsernameAlreadyExist extends Error {
    constructor() {
        super(`Username already exists`);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
    }
}