const inquirer = require('inquirer')

class RaftCLI {
  constructor (raft) {
    this.raft = raft

    this.activeSource = null
  }

  _rootPrompt () {
    const sources = this.raft.sources()
    return inquirer.prompt({
      type: 'list',
      name: 'selection',
      message: 'Available Sources',
      choices: Object.keys(sources).map(key => ({
        name: key,
        value: sources[key]
      }))
    }).then(answers => {
      console.log(answers)
    })
  }

  run () {
    if (!this.activeSource) {
      this._rootPrompt()
    }
  }

}

module.exports = {
  create: (raft) => new RaftCLI(raft)
}
