const TransactionsModel = require('../../../models/Transactions')

module.exports = async (ctx) => {
  let transactions = await new TransactionsModel().get(ctx.cardId)
  if (transactions.length === 0) {
    ctx.status = 404
    return
  }
  ctx.body = transactions
}
