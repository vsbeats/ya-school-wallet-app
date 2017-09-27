// Импортируем библиотеки
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')()
const router = require('koa-router')()
const serve = require('koa-static')
const AppError = require('./libs/app-error')

const cardsController = require('./controllers/cards')
const transactionsController = require('./controllers/transactions')
const errorController = require('./controllers/error')

const CardsModel = require('./models/Cards')
const TransactionsModel = require('./models/Transactions')

const app = new Koa()

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms.`)
})

router.get('/cards', cardsController.index)
router.post('/cards', cardsController.create)
router.delete('/cards/:id', cardsController.remove)

router.get('/cards/:id/transactions', transactionsController.index)
router.post('/cards/:id/transactions', transactionsController.create)

router.all('/error/:id', errorController)

// error handler
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log('Error detected', err)
    ctx.status = err instanceof AppError ? err.status : 500
    ctx.body = `Error [${err.message}]`
  }
})

app.use(async (ctx, next) => {
  ctx.cardsModel = new CardsModel()
  ctx.transactionsModel = new TransactionsModel()

  await Promise.all([
    ctx.cardsModel.loadData(),
    ctx.transactionsModel.loadData()
  ])

  await next()
})

app.use(bodyParser)
app.use(router.routes())
app.use(serve('./public'))

app.listen(3000, () => console.log('YM Node School App listening on port 3000!'))

module.exports = app
