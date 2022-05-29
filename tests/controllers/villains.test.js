const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { describe, it, beforeEach, afterEach } = require('mocha')
const { getAllVillains, getBySlug, addVillain } = require('../../controllers/villains')
const { villains } = require('../../models/index')
const { villainsList, villainOne, villainTwo, badVillain } = require('../mocks/villains')

chai.use(sinonChai)
const { expect } = chai

describe('testing the villains controller', () => {
  let sandbox = sinon.createSandbox()
  let stubbedFindOne = sandbox.stub(villains, 'findOne')
  let stubbedFindAll = sandbox.stub(villains, 'findAll')
  let stubbedCreate = sinon.stub(villains, 'create')
  let stubbedSend = sandbox.stub()
  let stubbedStatus = sandbox.stub()
  let stubbedSendStatus = sandbox.stub()
  let response = {
    send: stubbedSend,
    sendStatus: stubbedSendStatus,
    status: stubbedStatus,
  }

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  describe('getAllVillains', () => {
    // happy path
    it('gets all villains from the database and responds with a list of all the villains', async () => {
      stubbedFindAll.returns(villainsList)

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })
    // sad path
    it('returns status 500 when the database goes down, throws error', async () => {
      stubbedFindAll.throws('Error')

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSendStatus).to.have.been.calledWith(500)
    })
  })

  describe('getBySlug', () => {
    // happy path
    it('gets a villain from the database based on a slug', async () => {
      const request = { params: { slug: 'gaston' } }

      stubbedFindOne.returns(villainOne)

      await getBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'gaston' } })
      expect(stubbedFindOne).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(villainOne)
    })
    // sad path one
    it('returns 404 when no villain is found in the database', async () => {
      const request = { params: { slug: 'unknown_villain' } }

      stubbedFindOne.returns(null)

      await getBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'unknown_villain' } })
      expect(stubbedStatus).to.have.been.calledWith(404)
      // eslint-disable-next-line max-len
      expect(stubbedSend).to.have.been.calledWith('Sorry, the Queen of Hearts chopped this one\'s head off. We have no record of them now. Try again!')
    })
    // sad path two
    it('returns 500 when the database is down', async () => {
      const request = { params: { slug: 'gaston' } }

      stubbedFindOne.throws('Error')

      await getBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'gaston' } })
      expect(stubbedSendStatus).to.have.been.calledWith(500)
    })
  })

  describe('addVillain', () => {
    // happy path
    it('adds a new villain to the database', async () => {
      const request = { body: villainTwo }

      stubbedCreate.returns(villainTwo)

      await addVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(villainTwo)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedSend).to.have.been.calledWith(villainTwo)
    })
    // sad path one
    it('sends 400 status if not all requirements are met', async () => {
      const request = { body: badVillain }

      await addVillain(request, response)

      expect(stubbedStatus).to.have.been.calledWith(400)
      // eslint-disable-next-line max-len
      expect(stubbedSend).to.have.been.calledWith('We gotta know our enemies. Need a name, movie, and slug, please!')
    })
    // sad path two
    it('sends 500 status if database errors out', async () => {
      const request = { body: villainTwo }

      stubbedCreate.throws('Error')

      await addVillain(request, response)

      expect(stubbedCreate).to.be.calledWith(villainTwo)
      expect(stubbedSendStatus).to.have.been.calledWith(500)
    })
  })
})
