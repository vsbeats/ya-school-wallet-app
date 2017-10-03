const FileModel = require('./common/FileModel');
const AppError = require('../libs/app-error');
const CardsModel = require('../models/Cards');

class TransactionsModel extends FileModel {
	constructor() {
		super('transactions.json');
	}

	async get(cardId) {
		const cardTransactions = this._dataSource.filter((i) => i.cardId === cardId);
		if (cardTransactions.length === 0) throw new AppError(`Transactions for card ${cardId} not found`, 404);

		return cardTransactions;
	}

	static async remove() {
		throw new AppError('Transactions can\'t be removed', 403);
	}

	async create(transaction) {
		const isDataValid = transaction &&
		transaction.hasOwnProperty('cardId') && /^\d+$/.test(transaction.cardId) &&
		transaction.hasOwnProperty('type') && TransactionsModel.types.indexOf(transaction.type) >= 0 &&
				transaction.hasOwnProperty('data') &&
				transaction.hasOwnProperty('sum') && /^-?\d+$/.test(transaction.sum);

		if (!isDataValid) throw new AppError('Transaction data invalid', 400);

		const cardsModel = new CardsModel();
		await cardsModel.loadData();

		transaction.time = new Date();
		transaction = super.create(transaction);
		return transaction;
	}
}
TransactionsModel.types = ['paymentMobile', 'prepaidCard', 'card2Card'];

module.exports = TransactionsModel;
