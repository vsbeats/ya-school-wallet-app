module.exports = async function (ctx) {
  let card = ctx.request.body
  const newCard = await ctx.cardsModel.create(card)
  ctx.status = 201
  ctx.body = newCard
}
