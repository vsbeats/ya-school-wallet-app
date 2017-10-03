const AppError = require('../libs/app-error');

// eslint-disable-next-line no-unused-vars
module.exports = async (ctx) => {
	throw new AppError('Are you teapot?', 418);
};
