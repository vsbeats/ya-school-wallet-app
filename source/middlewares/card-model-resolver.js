module.exports = async (id, ctx, next) => {
	const cardId = Number(id);
	ctx.card = await ctx.cardsModel.getById(cardId);
	await next();
};
