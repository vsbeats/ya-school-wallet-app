module.exports = async (ctx) => {
  const cardId = Number(ctx.params.id)
  const card = await ctx.cardsModel.getById(cardId)
  let transactions = await ctx.transactionsModel.get(card.id)
  ctx.body = transactions
}
