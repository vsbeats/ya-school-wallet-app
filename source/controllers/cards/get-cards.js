const CardsModel = require('../../models/Cards')

module.exports = async function (ctx) { ctx.body = await new CardsModel().getAll() }
