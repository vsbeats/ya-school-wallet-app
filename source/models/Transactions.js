const FileModel = require('./common/FileModel')

class TransactionsModel extends FileModel {
  constructor () {
    super('transactions.json')
  }

  async get (cardId) {
    let allTransactions = this._dataSource
    let cardTransactions = allTransactions.filter((item) => {
      return item.cardId === cardId
    })
    return await cardTransactions
  }

  async remove (id) {
    throw await Error('Transactions can\'t be removed')
  }
}

module.exports = TransactionsModel
