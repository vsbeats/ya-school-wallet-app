module.exports = async (ctx) => {
	await ctx.cardsModel.remove(ctx.card.id);
	ctx.status = 200;
};
