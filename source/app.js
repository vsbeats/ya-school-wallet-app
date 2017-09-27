// Импортируем библиотеки
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')()
const router = require('koa-router')()
const serve = require('koa-static')

// Импортируем мидлвары
const {
  requestLogger,
  errorHandler,
  modelsToCtxInjector
} = require('./middlewares')

// Импортируем контроллеры
const {
  cardsController,
  transactionsController,
  errorController
} = require('./controllers')

const app = new Koa()

// Привязываем роуты
router.get('/cards', cardsController.index)
router.post('/cards', cardsController.create)
router.delete('/cards/:id', cardsController.remove)
router.get('/cards/:id/transactions', transactionsController.index)
router.post('/cards/:id/transactions', transactionsController.create)
router.all('/error/:id', errorController)

// Подключаем мидлвары
app.use(requestLogger)
app.use(errorHandler)
app.use(modelsToCtxInjector)
app.use(bodyParser)
app.use(router.routes())
app.use(serve('./public'))

app.listen(3000, () => console.log('YM Node School App listening on port 3000!'))

// Для тестов
module.exports = app
