module.exports = async function (ctx) {
  const cardId = Number(ctx.params.id)
  await ctx.cardsModel.remove(cardId)
  ctx.status = 200
}
