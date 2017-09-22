const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const fs = require('fs')

chai.should()
chai.use(chaiHttp)

// Основной блок теста
describe('Cards', () => {
  beforeEach((done) => { // Перед каждым тестом чистим базу и добавляем 1 тестовую карту
    let cards = [ { cardNumber: '8123456789012345', balance: 0 } ]
    fs.writeFile(`${__dirname}/../source/cards.json`, JSON.stringify(cards), (err) => {
      if (err) return done(err)
      done()
    })
  })

  // Тест для GET запроса /cards
  describe('GET /cards', () => {
    it('It should GET all cards and return JSON', (done) => {
      chai.request(server)
        .get('/cards')
        .end((err, res) => {
          res.should.have.status(200)
          res.should.have.header('content-type', /application\/json/)
          res.body.should.be.a('array').that.lengthOf(1)
          if (err) return done(err)
          done()
        })
    })
  })

  // Тест для POST запроса /cards
  describe('POST /cards', () => {
    it('It should not add a card with invalid card number (12 digits (13 min) & bad Luhn)', (done) => {
      let requestBody = {
        cardNumber: '1234 5678 9012'
      }
      chai.request(server)
        .post('/cards')
        .send(requestBody)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })

    it('It should add a card with valid card number', (done) => {
      // Валидный номер
      let requestBody = {
        cardNumber: '4561 2612 1234 5467'
      }
      chai.request(server)
        .post('/cards')
        .send(requestBody)
        .end((err, res) => {
          res.should.have.status(200)
          if (err) return done(err)
          done()
        })
    })
  })

  // Тест для DELETE запроса /cards/:id
  describe('DELETE /cards/:id', () => {
    it('It should not DELETE card by not founded digit id', (done) => {
      chai.request(server)
        .delete('/cards/5') // Всё равно перед каждым тестом очищаем БД, так что 5 никогда не попадётся
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })

    it('It should DELETE card by digit id', (done) => {
      chai.request(server)
        .delete('/cards/0')
        .end((err, res) => {
          res.should.have.status(200)
          if (err) return done(err)
          done()
        })
    })

    it('It should not DELETE card by alphabetic id', (done) => {
      chai.request(server)
        .delete('/cards/a')
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
})
