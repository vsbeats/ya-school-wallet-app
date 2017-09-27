const AppError = require('../libs/app-error')

module.exports = async (ctx) => {
  throw new AppError('Are you teapot?', 418)
}
