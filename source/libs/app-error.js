class AppError extends Error {
	constructor(message, status) {
		super(message);
		this._status = status;
	}

	get status() {
		return this._status;
	}
}

module.exports = AppError;
