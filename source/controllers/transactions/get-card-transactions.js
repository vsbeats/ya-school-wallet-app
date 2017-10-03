module.exports = async (ctx) => {
	const transactions = await ctx.transactionsModel.get(ctx.card.id);
	ctx.body = transactions;
};
