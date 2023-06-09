export class ServerHttpError extends Error {
	constructor(error?: Error) {
		super('Server internal error. Try again soon.');

		this.name = this.constructor.name;

		this.stack = error?.stack;
	}
}

export class RequiredFieldError extends Error {
	constructor(fieldName: string) {
		super(`The field ${fieldName} is required`);

		this.name = this.constructor.name;
	}
}

export class UnauthorizedError extends Error {
	constructor() {
		super('Unauthorized');

		this.name = this.constructor.name;
	}
}
