const chalk = require('chalk')
const inquirer = require('inquirer')
const log = require('./logger')

const Views = {
  ROOT: 'ROOT',
  SOURCE: 'SOURCE',
  ACTION: 'ACTION'
}

class RaftCLI {
  constructor (raft, prompter) {
    this.raft = raft
    this.prompter = prompter
    this.state = {
      view: Views.ROOT,
      activeSource: null,
      activeAction: null
    }
  }

  _rootPrompt () {
    const sources = this.raft.sources()
    const choices = Object.keys(sources).map(key => ({
      name: key,
      value: {
        view: Views.SOURCE,
        activeSource: key
      }
    }))
    return this.prompter.prompt({
      type: 'list',
      name: 'selection',
      message: 'Available Sources',
      choices
    }).then(answers => answers.selection)
  }

  _updateState (updates) {
    const newState = Object.assign({}, this.state, updates)
    log.debug({old: this.state, updates, new: newState}, 'Updated state')
    this.state = newState
  }

  _sourcePrompt () {
    const { activeSource } = this.state
    const source = this.raft.get(activeSource)
    const backChoice = {
      name: `Back To Root`,
      value: {
        view: Views.ROOT,
        activeSource: null
      }
    }
    const sourceOptions = source.options()
    const actionChoices = Object.keys(sourceOptions).map(key => ({
      name: key,
      value: {
        view: Views.ACTION,
        activeAction: key
      }
    }))
    return inquirer.prompt({
      type: 'list',
      name: 'selection',
      message: `${activeSource} Available Actions`,
      choices: [backChoice, ...actionChoices]
    }).then(answers => answers.selection)
  }

  _actionPrompt () {
    const { activeSource, activeAction } = this.state
    const source = this.raft.get(activeSource)
    const action = source.options()[activeAction]
    const optionTypes = action.optionTypes
    const questions = this._questionsFromOptionTypes(optionTypes)

    console.log(`Options for ${activeSource}:${activeAction}`)
    return inquirer.prompt(questions).then(actionOptions => {
      return source.do(activeAction, actionOptions).then(res => {
        console.log(JSON.stringify(res, null, 2))
      })
    }).then(() => ({
      view: Views.SOURCE,
      activeAction: null
    }))
  }

  _questionsFromOptionTypes (optionTypes) {
    const keys = Object.keys(optionTypes)
    return keys.map(key => {
      const question = optionTypes[key]
      return Object.assign({}, question, {
        name: key,
        message: `${key}`
      })
    })
  }

  _promptLoop () {
    let p
    switch (this.state.view) {
      case Views.ROOT:
        p = this._rootPrompt()
        break
      case Views.SOURCE:
        p = this._sourcePrompt()
        break
      case Views.ACTION:
        p = this._actionPrompt()
        break
    }
    p.then((stateUpdates = {}) => {
      this._updateState(stateUpdates)
      this._promptLoop()
    })
  }

  run () {
    const style = chalk.blue
    console.log(style('Welcome to Raft CLI!'))
    this._promptLoop()
  }
}

module.exports = {
  create: (raft) => new RaftCLI(raft, inquirer)
}
