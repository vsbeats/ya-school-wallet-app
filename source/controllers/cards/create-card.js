const CardsModel = require('../../models/Cards')
const { bankUtils } = require('../../libs/utils')

module.exports = async function (ctx) {
  const cardsModel = new CardsModel()

  let card = ctx.request.body

  if (
    card && card.hasOwnProperty('cardNumber') && card.hasOwnProperty('balance') &&
    /^\d{13,19}$/.test(card.cardNumber) &&
    /^\d+$/.test(card.balance) &&
    bankUtils.validateCardNumberLuhn(card.cardNumber)
  ) {
    try {
      await cardsModel.create(card)
      ctx.status = 201
      return
    } catch (err) {
      ctx.status = 400
    }
  }
  ctx.status = 400
}
