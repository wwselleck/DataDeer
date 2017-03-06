/* global describe, it, expect */

const { _verifyPluginCompat } = require('../plugin-loader')

describe('plugin-loader', () => {
  describe('_verifyPluginCompat', () => {
    it('contains errors when plugin does not implement fetch', () => {
      const illegalPlugin = {}

      expect(_verifyPluginCompat(illegalPlugin).length).not.toEqual(0)
    })
  })
})
