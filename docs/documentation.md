## Raft Documentation
All packages are documented using JSDoc comments and documentation is generated using both JSDoc and [jsdoc2md](https://github.com/jsdoc2md).

### Commands
`npm run docs:clean`
Removes the `docs/api` folder and `API.md` file for each package

`npm run docs:build`
Builds the documentation from the JSDoc comments and outputs the HTML to `docs/api` and the markdown to `API.md` for each package.

`npm run docs`
Runs clean and build
