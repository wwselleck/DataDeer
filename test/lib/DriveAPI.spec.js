/* eslint-env mocha */

let chai = require('chai')
let expect = chai.expect

let DriveAPI = require('../../lib/DriveAPI.js')

describe('DriveAPI', function () {
  describe('::Constructor', function () {
    it('should set the correct values in constructor', function (done) {
      let auth = {a: 2}
      let sheetsApi = {b: 3}
      let instance = new DriveAPI(auth, sheetsApi)

      expect(instance.api.a).to.equal(2)
      expect(instance.sheetsApi.b).to.equal(3)
      done()
    })
  })

  describe('::setAuth', function () {
    it('should set DriveAPI::auth', function (done) {
      let instance = new DriveAPI({}, {})
      instance.setAuth({w: 3})
      expect(instance.auth.w).to.equal(3)
    })
  })
})

