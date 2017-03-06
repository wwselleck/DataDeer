class RaftPluginInterface {
  constructor (raft) {
    this.raft = raft
  }

  addDataSource (id, dataSource) {
    this.raft.dataManager.use(id, dataSource)
  }
}

module.exports = RaftPluginInterface
