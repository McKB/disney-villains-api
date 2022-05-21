const Sequelize = require('sequelize')
const villainsMod = require('./villains')

const connection = new Sequelize('villains', 'villains_user', 'villains', {
  host: 'localhost',
  dialect: 'mysql'
})

const villains = villainsMod(connection, Sequelize)

module.exports = { villains }
