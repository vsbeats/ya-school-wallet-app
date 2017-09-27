const AppError = require('../libs/app-error')
const { bankUtils } = require('../libs/utils')
const FileModel = require('./common/FileModel')

class CardsModel extends FileModel {
  constructor () {
    super('cards.json')
  }

  async create (card) {
    const isDataValid = card && card.hasOwnProperty('cardNumber') && card.hasOwnProperty('balance') &&
                        /^\d{13,19}$/.test(card.cardNumber) &&
                        /^\d+$/.test(card.balance) &&
                        bankUtils.validateCardNumberLuhn(card.cardNumber)
    if (!isDataValid) {
      throw new AppError('Card data is invalid', 400)
    }
    const newEntity = await super.create(card)
    return newEntity
  }
}

module.exports = CardsModel
