"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameAlreadyExist = void 0;
class UsernameAlreadyExist extends Error {
    constructor() {
        super(`Username already exists`);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
    }
}
exports.UsernameAlreadyExist = UsernameAlreadyExist;
