export class IncorrectPassword extends Error {
    constructor() {
        super(`Wrong password`);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
    }
}