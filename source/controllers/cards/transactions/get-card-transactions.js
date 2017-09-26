module.exports = async (ctx) => {
  ctx.body = await `Get card transactions to card with id ${ctx.cardId}`
}
