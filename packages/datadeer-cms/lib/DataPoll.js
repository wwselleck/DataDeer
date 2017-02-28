const start = (fetch, cb, interval) => {
  const f = () => {
    fetch().then(data => {
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
