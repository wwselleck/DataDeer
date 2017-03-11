const inquirer = require('inquirer')

const Views = {
  ROOT: 'ROOT',
  SOURCE: 'SOURCE',
  ACTION: 'ACTION'
}

class RaftCLI {
  constructor (raft) {
    this.raft = raft
    this.state = {
      view: Views.ROOT,
      activeSource: null,
      activeAction: null
    }
  }

  _rootPrompt () {
    const sources = this.raft.sources()
    return inquirer.prompt({
      type: 'list',
      name: 'selection',
      message: 'Available Sources',
      choices: Object.keys(sources)
    })
  }

  _updateState (updates) {
    this.state = {
      ...this.state,
      ...updates
    }
  }

  _sourcePrompt () {
    console.log(this.activeSource)
    const source = this.raft.get(this.activeSource)
    console.log(source)
    const backChoice = {
      name: `Back To Sources`,
      value: {
        view: Views.SOURCE,
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
      message: `${this.activeSource} Available Actions`,
      choices: [backChoice, ...actionChoices]
    })
  }

  _actionPrompt () {
    const { activeSource, activeAction } = this.state
    const source = this.raft.get(activeSource)
    const sourceOptions = source.options()
    const action = sourceOptions[activeAction]
  }

  run () {
    let p
    switch (this.state.view) {
      case Views.ROOT:
        this._rootPrompt()
        break
      case Views.SOURCE:
        this._sourcePrompt()
        break
      case Views.ACTION:
        this._actionPrompt()
        break
    }
    p.then((stateUpdates) => {
      this._updateState(stateUpdates)
      this.run()
    })
  }
}

module.exports = {
  create: (raft) => new RaftCLI(raft)
}
