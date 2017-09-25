const path = require('path')
const fs = require('fs')
const promisify = require('util').promisify
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const bufferToJSON = require('./utils').helpers.bufferToJSON

const storage = {
  cards: {
    path: path.resolve(__dirname, '../source/cards.json'),
    notFoundMsg: 'Card not found',

    /**
     * Получение всех карт
     * @return {Promise}
     */
    getAll () {
      return readFile(this.path).then(bufferToJSON)
    },

    /**
     * Получение одной карты по id
     * @param  {Integer} id идентификатор карты
     * @return {Promise}
     */
    getById (id) {
      return this.getAll()
        .then(cards => {
          if (cards[id]) return cards[id]
          throw Error(this.notFoundMsg)
        })
    },

    /**
     * Дамп в хранилище карт
     * @param  {Array} cards новый массив с картами
     * @return {Promise}
     */
    dump (cards) {
      return writeFile(this.path, JSON.stringify(cards))
    }
  }
}

module.exports = storage
