const { villains } = require('../models/index')

const getAllVillains = async (req, res) => {
  try {
    const allVillains = await villains.findAll()

    return res.status(200).send(allVillains)
  } catch (error) {
    return res.sendStatus(500)
  }
}

const getBySlug = async (req, res) => {
  try {
    const searchedSlug = req.params.slug

    const villain = await villains.findOne({
      where: { slug: searchedSlug }
    })

    if (villain) {
      return res.status(200).send(villain)
    } else {
      return res.status(404).send('Sorry, the Queen of Hearts chopped this one\'s head off. We have no record of them now. Try again!') // eslint-disable-line max-len
    }
  } catch (error) {
    return res.sendStatus(500)
  }
}

const addVillain = async (req, res) => {
  try {
    const { name, movie, slug } = req.body

    if (!name || !movie || !slug) {
      return res.status(400).send('We gotta know our enemies. Need a name, movie, and slug, please!')
    }

    const newVillain = await villains.create({ name, movie, slug })

    return res.status(201).send(newVillain)
  } catch (error) {
    return res.sendStatus(500)
  }
}

module.exports = { getAllVillains, getBySlug, addVillain }
