const path = require('path')
const fs = require('fs')
const Model = require('./Model')
const AppError = require('../../libs/app-error')

class FileModel extends Model {
  constructor (sourceFileName) {
    super()
    this._dataSourceFile = path.join(__dirname, '..', '..', 'data', sourceFileName)
    this._dataSource = null
  }

  async loadData () {
    if (!this._dataSource) {
      await new Promise((resolve, reject) => {
        fs.readFile(this._dataSourceFile, (err, data) => {
          if (err) {
            return reject(err)
          }
          try {
            this._dataSource = JSON.parse(data)
            return resolve()
          } catch (err) {
            return reject(err)
          }
        })
      })
    }
    return this._dataSource
  }

  async getAll () {
    const data = await this.loadData()
    return data
  }

  async getById (id) {
    const entity = this._dataSource.find((item) => {
      return item.id === id
    })

    if (!entity) {
      throw new AppError(`Entity with id ${id} not found`, 404)
    }

    return entity
  }

  async create (entity) {
    entity.id = this._dataSource.length + 1
    this._dataSource.push(entity)
    await this._saveUpdates()
    return entity
  }

  async remove (id) {
    const entity = await this.getById(id)
    const entityIndex = this._dataSource.indexOf(entity)
    if (!entityIndex) throw new AppError('Can\'t find card index in database file', 400)

    this._dataSource.splice(entityIndex, 1)
    await this._saveUpdates()
  }

  async _saveUpdates () {
    await new Promise(resolve => {
      fs.writeFile(this._dataSourceFile, JSON.stringify(this._dataSource, null, 4), resolve)
    })
  }
}

module.exports = FileModel
