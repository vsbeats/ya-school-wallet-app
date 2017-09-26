const CardsModel = require('../../models/Cards')

module.exports = async function (ctx) {
  const cardsModel = new CardsModel()

  try {
    let cards = await cardsModel.getAll()
    if (cards[ctx.cardId] === undefined) {
      ctx.status = 404
      ctx.message = 'Card not found'
      return
    }
    await cardsModel.remove(ctx.cardId)
    ctx.status = 200
  } catch (err) {
    ctx.status = 400
  }
}
