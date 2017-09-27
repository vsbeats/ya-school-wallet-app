const FileModel = require('./common/FileModel')
const AppError = require('../libs/app-error')

class TransactionsModel extends FileModel {
  constructor () {
    super('transactions.json')
  }

  async get (cardId) {
    let cardTransactions = this._dataSource.filter((item) => {
      return item.cardId === cardId
    })

    if (cardTransactions.length === 0) {
      throw new AppError(`Transactions for card ${cardId} not found`, 404)
    }

    return cardTransactions
  }

  async remove (id) {
    throw new AppError('Transactions can\'t be removed', 403)
  }

  async create (transaction) {
    const isDataValid = transaction &&
                        transaction.hasOwnProperty('cardId') && /^\d+$/.test(transaction.cardId) &&
                        transaction.hasOwnProperty('type') && TransactionsModel.types.indexOf(transaction.type) >= 0 &&
                        transaction.hasOwnProperty('data') &&
                        transaction.hasOwnProperty('sum') && /^\d+$/.test(transaction.sum)
    if (!isDataValid) throw new AppError('Transaction data invalid', 400)

    transaction.time = new Date()
    transaction = super.create(transaction)
    return transaction
  }
}
TransactionsModel.types = ['paymentMobile', 'prepaidCard', 'card2Card']

module.exports = TransactionsModel
