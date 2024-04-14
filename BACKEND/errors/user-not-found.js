"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFound = void 0;
class UserNotFound extends Error {
    constructor(id) {
        super(`The user with name: ${id} not found.`);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
    }
}
exports.UserNotFound = UserNotFound;
