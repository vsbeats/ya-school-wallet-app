const path = require('path')
const fs = require('fs')
const Model = require('./Model')

class FileModel extends Model {
  constructor (sourceFileName) {
    super()
    this._dataSourceFile = path.join(__dirname, '..', '..', 'data', sourceFileName)
    this._dataSource = require(this._dataSourceFile)
  }

  async getAll () {
    return await this._dataSource
  }

  async create (card) {
    this._dataSource.push(card)
    await this._saveUpdates()
    return card
  }

  async remove (id) {
    this._dataSource.splice(id, 1)
    this._saveUpdates()
  }

  async _saveUpdates () {
    await new Promise(resolve => {
      fs.writeFile(this._dataSourceFile, JSON.stringify(this._dataSource, null, 4), resolve)
    })
  }
}

module.exports = FileModel
