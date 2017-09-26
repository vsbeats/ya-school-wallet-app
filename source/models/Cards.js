const FileModel = require('./common/FileModel')

class CardsModel extends FileModel {
  constructor () {
    super('cards.json')
  }
}

module.exports = CardsModel
