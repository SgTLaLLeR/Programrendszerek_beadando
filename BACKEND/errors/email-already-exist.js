"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyExist = void 0;
class EmailAlreadyExist extends Error {
    constructor() {
        super(`Email already exist`);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
    }
}
exports.EmailAlreadyExist = EmailAlreadyExist;
