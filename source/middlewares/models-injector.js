const CardsModel = require('../models/Cards')
const TransactionsModel = require('../models/Transactions')

module.exports = async (ctx, next) => {
  ctx.cardsModel = new CardsModel()
  ctx.transactionsModel = new TransactionsModel()

  await Promise.all([
    ctx.cardsModel.loadData(),
    ctx.transactionsModel.loadData()
  ])

  await next()
}
