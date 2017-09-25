const storage = require('../../libs/storage')
const bankUtils = require('../../libs/utils').bankUtils

const cardsController = {

  /**
   * Получение всех карт из хранилища
   */
  index (req, res) {
    storage.cards.getAll()
      .then(cards => res.json(cards))
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  },

  /**
   * Получение одной карты по id
   */
  show (req, res) {
    let id = req.params.id
    storage.cards.getById(id)
      .then(card => res.json(card))
      .catch(err => {
        console.log(err)
        res.status(404).send(storage.cards.notFoundMsg)
      })
  },

  /**
   * Добавление карты в хранилище
   */
  store (req, res) {
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
      .then(() => res.sendStatus(201))
      .catch(err => {
        console.log(err)
        if (!res.headersSent) res.sendStatus(400)
      })
  },

  /**
   * Удаление карты из хранилища по ключу
   */
  destroy (req, res) {
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
  }
}

module.exports = cardsController
