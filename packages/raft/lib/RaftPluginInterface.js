class RaftPluginInterface {
  constructor (raft) {
    this.raft = raft
  }

  addDataSource (id, dataSource) {
    this.raft.store.addSource(id, dataSource)
  }
}

module.exports = RaftPluginInterface
