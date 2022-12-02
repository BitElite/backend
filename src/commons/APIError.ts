export class ApiError extends Error {
    status: number;
    errors: any;
    message: string;
    constructor(message: string, status: number, errors: any, stack?: string) {
        super(message);
        this.message = message;
        this.status = status;
        this.errors = errors;
        this.stack = stack
    }
}