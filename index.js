// Импортируем библиотеки
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const promisify = require('util').promisify
const { bufferToJSON } = require('./libs/utils').helpers
const bankUtils = require('./libs/utils').bankUtils
const storage = require('./libs/storage')
const app = express()

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

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
  res.json({
    result: 'success',
    amount,
    from,
    to
  })
})

/**
 * Получение всех карт из хранилища
 */
app.get('/cards', (req, res) => {
  readFile(storage.cards)
    .then(bufferToJSON)
    .then(cards => res.json(cards))
    .catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
})

/**
 * Добавление карты в хранилище
 */
app.post('/cards', (req, res) => {
  readFile(storage.cards)
    .then(bufferToJSON)
    .then((cards) => {
      let hasErrors = false
      let cardNumber = req.body.cardNumber || ''
      cardNumber = cardNumber.replace(/[^\d]/g, '')

      // Валидируем cardNumber
      const validCardNumberRe = /^\d{13,19}$/
      if (
        !validCardNumberRe.test(cardNumber) ||
        !bankUtils.validateCardNumberLuhn(cardNumber)
      ) {
        hasErrors = true
      }

      if (hasErrors) return res.sendStatus(400)

      let newCard = {
        cardNumber,
        balance: 0
      }

      cards.push(newCard)

      writeFile(storage.cards, JSON.stringify(cards))
        .then(() => res.sendStatus(200))
        .catch((err) => {
          console.log(err)
          res.sendStatus(400)
        })
    }).catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
})

/**
 * Удаление карты из хранилища по ключу
 */
app.delete('/cards/:id', (req, res) => {
  let id = req.params.id
  readFile(storage.cards)
    .then(bufferToJSON)
    .then((cards) => {
      if (cards[id] === undefined) return res.status(404).send('Card not found')

      cards.splice(id, 1)

      writeFile(storage.cards, JSON.stringify(cards)).then(() => {
        res.sendStatus(200)
      }).catch((err) => {
        console.log(err)
        res.sendStatus(400)
      })
    })
})

/**
 * Цепляем Express слушать порт
 */
app.listen(3000, () => {
  console.log('YM Node School App listening on port 3000!')
})

// Для тестов экспортируем модуль приложения
module.exports = app
