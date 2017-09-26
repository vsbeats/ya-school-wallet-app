// Импортируем библиотеки
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')()
const router = require('koa-router')()
const serve = require('koa-static')

const cardsController = require('./controllers/cards')
const transactionsController = require('./controllers/cards/transactions')

const app = new Koa()

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms.`)
})

router.param('id', async (id, ctx, next) => {
  ctx.cardId = id
  await next()
})

router.get('/cards', cardsController.index)
router.post('/cards', cardsController.create)
router.delete('/cards/:id', cardsController.remove)

router.get('/cards/:id/transactions', transactionsController.index)
router.post('/cards/:id/transactions', transactionsController.create)

app.listen(3000, () => console.log('YM Node School App listening on port 3000!'))

app.use(bodyParser)
app.use(router.routes())
app.use(serve('./public'))

module.exports = app
