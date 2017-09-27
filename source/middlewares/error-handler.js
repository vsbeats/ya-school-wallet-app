const AppError = require('../libs/app-error')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log('Error detected', err)
    ctx.status = err instanceof AppError ? err.status : 500
    ctx.body = `Error [${err.message}]`
  }
}
