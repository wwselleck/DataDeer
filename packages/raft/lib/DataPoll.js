const start = (fetcher, cb, interval) => {
  const f = () => {
    fetcher.fetch().then(data => {
      cb(data)
    })
  }
  // Run it once without delay
  f()
  return setInterval(f, interval)
}

const stop = (poll) => {
  clearInterval(poll)
}

module.exports = {start, stop}
