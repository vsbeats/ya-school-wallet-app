// Импортируем библиотеки
const express = require('express')
const bodyParser = require('body-parser')
const bankUtils = require('./libs/utils').bankUtils
const storage = require('./libs/storage')
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

/**
 * Перевод средств между картами
 */
app.get('/transfer', (req, res) => {
  const {amount, from, to} = req.query
  storage.cards.getAll()
    .then(cards => {
      if (cards[from] === undefined || cards[to] === undefined) {
        res.status(404).send(storage.cards.notFoundMsg)
        throw Error(storage.cards.notFoundMsg)
      }
      if (cards[from].balance < amount) {
        res.status(400).send(storage.cards.notEnoughMsg)
        throw Error(storage.cards.notEnoughMsg)
      }
      cards[from].balance -= parseInt(amount)
      cards[to].balance += parseInt(amount)
      return storage.cards.dump(cards)
    })
    .then(() => res.json({ result: 'success', amount, from, to }))
    .catch(err => {
      console.log(err)
      if (!res.headersSent) res.sendStatus(400)
    })
})

/**
 * Получение всех карт из хранилища
 */
app.get('/cards', (req, res) => {
  storage.cards.getAll()
    .then(cards => res.json(cards))
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

/**
 * Получение одной карты по id
 */
app.get('/cards/:id', (req, res) => {
  let id = req.params.id
  storage.cards.getById(id)
    .then(card => res.json(card))
    .catch(err => {
      console.log(err)
      res.status(404).send(storage.cards.notFoundMsg)
    })
})

/**
 * Добавление карты в хранилище
 */
app.post('/cards', (req, res) => {
  storage.cards.getAll()
    .then(cards => {
      let cardNumber = req.body.cardNumber || ''
      cardNumber = cardNumber.replace(/[^\d]/g, '')

      const validCardNumberRe = /^\d{13,19}$/
      if (
        !validCardNumberRe.test(cardNumber) ||
        !bankUtils.validateCardNumberLuhn(cardNumber)
      ) {
        throw Error('Validation error')
      }

      let newCard = {
        cardNumber,
        balance: 0
      }

      cards.push(newCard)
      return storage.cards.dump(cards)
    })
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.log(err)
      if (!res.headersSent) res.sendStatus(400)
    })
})

/**
 * Удаление карты из хранилища по ключу
 */
app.delete('/cards/:id', (req, res) => {
  const id = req.params.id
  storage.cards.getAll()
    .then(cards => {
      if (cards[id] === undefined) {
        res.status(404).send(storage.cards.notFoundMsg)
        throw Error(storage.cards.notFoundMsg)
      }
      cards.splice(id, 1)
      return storage.cards.dump(cards)
    })
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.log(err)
      if (!res.headersSent) res.sendStatus(400)
    })
})

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
