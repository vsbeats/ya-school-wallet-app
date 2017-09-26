module.exports = async (ctx) => {
  ctx.body = await `Create card transaction to card with id ${ctx.cardId}`
}
