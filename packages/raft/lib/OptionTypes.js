const List = {
  type: 'input',
  filter: (input) => {
    return JSON.parse(input)
  }
}

const Object = {
  type: 'input',
  filter: (input) => {
    return JSON.parse(input)
  }
}

module.exports = {
  List, Object
}
