"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncorrectPassword = void 0;
class IncorrectPassword extends Error {
    constructor() {
        super(`Wrong password`);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
    }
}
exports.IncorrectPassword = IncorrectPassword;
