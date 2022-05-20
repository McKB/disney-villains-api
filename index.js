const express = require('express')
const { getAllVillains, getBySlug, addVillain } = require('./controllers/villains')
const app = express()
const port = 1337

app.get('/villains', getAllVillains)
app.get('/villains/:slug', getBySlug)
app.post('/villains', express.json(), addVillain)

app.all('*', (req, res) => {
  return res.status(404).send(`Evil took a different route. Try http://localhost:${port}/villains.`)
})

app.listen(port, () => {
  console.log('listening @ http://localhost:1337...') // eslint-disable-line no-console
})
