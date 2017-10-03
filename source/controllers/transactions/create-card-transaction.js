module.exports = async (ctx) => {
	let transaction = ctx.request.body;
	transaction.cardId = ctx.card.id;

	transaction = await ctx.transactionsModel.create(transaction);
	ctx.status = 201;
	ctx.body = transaction;
};
