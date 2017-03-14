/**
 * @module lib/optionTypes
 */

/**
 * @typedef {Object} OptionType
 */

/**
 * Represents a list OptionType. Use this for actionOptions that require an array answer.
 * @example
 * const { OptionTypes } = require('@wwselleck/raft')
 * class MySource {
 *   options() {
 *    return {
 *      myAction: {
 *        f: '_MyAction',
 *        optionTypes: {
 *          listOfData: OptionTypes.List
 *        }
 *      }
 *    }
 *   }
 * }
 * @type {module:lib/optionTypes~OptionType}
 */
const List = {
  type: 'input',
  filter: (input) => {
    return JSON.parse(input)
  }
}

/**
 * Represents a list OptionType. Use this for actionOptions that require an array answer.
 * @type {module:lib/optionTypes~OptionType}
 * @example
 * const { OptionTypes } = require('@wwselleck/raft')
 * class MySource {
 *   options() {
 *    return {
 *      myAction: {
 *        f: '_MyAction',
 *        optionTypes: {
 *          objectOfData: OptionTypes.Obj
 *        }
 *      }
 *    }
 *   }
 * }
 */
const Obj = {
  type: 'input',
  filter: (input) => {
    return JSON.parse(input)
  }
}

module.exports = {
  List, Obj
}
