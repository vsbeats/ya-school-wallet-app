// Импортируем библиотеки
const express = require('express')
const bodyParser = require('body-parser')
const cardsController = require('./controllers/cards')

const app = express()

// Подключаем middlwares
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(bodyParser.json({type: 'application/json'}))

/**
 * Главная страница
 */
app.get('/', (req, res) => {
  res.send(`<!doctype html>
    <html>
      <head>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>Hello Smolny!</h1>
    </body>
  </html>`)
})

/**
 * Обработчик ошибки
 */
app.get('/error', (req, res) => {
  throw Error('Oops!')
})

app.get('/cards', cardsController.index)
app.get('/cards/:id', cardsController.show)
app.post('/cards', cardsController.store)
app.delete('/cards/:id', cardsController.destroy)

/**
 * Цепляем Express слушать порт
 */
app.listen(3000, () => {
  console.log('YM Node School App listening on port 3000!')
})

/**
 * Логер ошибок
 */
app.use((err, req, res, next) => {
  // пока просто console.log
  console.log('Server error', err)
  res.sendStatus(500)
})

// Для тестов экспортируем модуль приложения
module.exports = app
