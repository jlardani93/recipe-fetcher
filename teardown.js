const { resetDatabase } = require('./backend/db/testUtils')

module.exports = async function (){
  await resetDatabase()
  await global.__MONGOD__.close()
}