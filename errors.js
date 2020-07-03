class NotFoundError extends Error {
	constructor(path) {
		super('Not Found');
		this.name = 'NotFoundError';
		this.message = `Requested path ${path} does not exists`;
		this.code = 'not_found';
		this.status = 404;
	}
}

class MethodNotSupportedError extends Error {
	constructor(method, path) {
		super('MethodNotSupported');
		this.name = 'MethodNotSupported';
		this.message = `Method ${method} not supported for requested path ${path}`;
		this.code = 'not_found';
		this.status = 404;
	}
}

export { NotFoundError, MethodNotSupportedError };
