module.exports = async (ctx) => {
  let transaction = ctx.request.body
  transaction.cardId = Number(ctx.params.id)
  await ctx.cardsModel.getById(transaction.cardId)

  transaction = await ctx.transactionsModel.create(transaction)
  ctx.status = 201
  ctx.body = transaction
}
