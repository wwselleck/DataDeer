const start = (fetch, cb, interval) => {
  return setInterval(() => {
    fetch().then(data => {
      cb(data)
    })
  }, interval)
}

const stop = (poll) => {
  clearInterval(poll)
}

module.exports = {start, stop}
