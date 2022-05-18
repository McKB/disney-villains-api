const express = require('express')
const { getAllVillains, getBySlug, addVillain } = require('./controllers/villains')
const app = express()

app.get('/villains', getAllVillains)
app.get('/villains/:slug', getBySlug)
app.post('/villains', express.json(), addVillain)


app.listen(1337, () => {
  console.log('listening @ http://localhost:1337...') // eslint-disable-line no-console
})
