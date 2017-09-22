// Импортируем библиотеки
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()

// Подключаем middlwares
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

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
  fs.readFile('./source/cards.json', (err, data) => {
    if (err) return res.sendStatus(400)
    res.json(
      JSON.parse(data.toString())
    )
  })
})

/**
 * Добавление карты в хранилище
 */
app.post('/cards', (req, res) => {
  fs.readFile('./source/cards.json', (err, data) => {
    if (err) return res.sendStatus(400)

    let cards = JSON.parse(data.toString())
    let hasErrors = false

    // Валидируем cardNumber
    const validCardNumberRe = /^\d{16}$/
    if (!validCardNumberRe.test(req.body.cardNumber)) {
      hasErrors = true
    }

    if (hasErrors) return res.sendStatus(400)

    let newCard = {
      cardNumber: req.body.cardNumber,
      balance: 0
    }
    cards.push(newCard)
    fs.writeFile('./source/cards.json', JSON.stringify(cards), (err) => {
      res.sendStatus((err) ? 400 : 200)
    })
  })
})

/**
 * Удаление карты из хранилища по ключу
 */
app.delete('/cards/:id', (req, res) => {
  let id = req.params.id
  fs.readFile('./source/cards.json', (err, data) => {
    if (err) return res.sendStatus(400)

    let cards = JSON.parse(data.toString())

    if (cards[id] === undefined) return res.sendStatus(400)

    cards.splice(id, 1)
    fs.writeFile('./source/cards.json', JSON.stringify(cards), (err) => {
      res.sendStatus((err) ? 400 : 200)
    })
  })
})

/**
 * Цепляем Express слушать порт
 */
app.listen(3000, () => {
  console.log('YM Node School App listening on port 3000!')
})
