# Raft CLI

To use the raft-cli, first install it
`npm install --save-dev @wwselleck/raft-cli`

You'll first want to make a configuration file. A Raft configuration file exports an object that can then be passed to `Raft.create`. For example,

```javascript
// raft.config.js
const googledrive = require('@wwselleck/raft-plugin-googledrive')

module.exports = {
  datasources: [
    gdrive: {
        source: googledrive({
          authConfig: {
            type: 'service',
            path: path.resolve(__dirname, 'creds', 'gdrive_creds.json')
          },
          baseDirName: 'MyData'
        })
    }
  ]
}
```
I call mine `raft.config.js`, but it doesn't have to be called that.

To use it, run `raft` specifying your configuration file with `--config`.

`$(npm bin)/raft --config ./config/raft.config.js`

You'll then be presented with a screen that looks like this.

<img src="/packages/raft-cli/docs/1.png" width="300"/>

From here you can select any of your configured data sources. I only have one so I'll select that one.

<img src="/packages/raft-cli/docs/2.png" width="350"/>

Now you'll be able to see a list of actions that you can perform on the selected data source. Again, I only have one, so I'll select that one.

<img src="/packages/raft-cli/docs/3.png" width="300"/>

You're then prompted to enter whatever parameters that action needs. Right now, you have to enter something that is valid JSON (i.e. will not throw an error when passed to `JSON.parse`). So for example if you want to enter a list of the string `data`, you'll enter `["data"]` (note that JSON requires double quoted strings). This will hopefully change at some point, but for now that's a requirement.

Once you're done, the action will be executed and the results logged to you.

<img src="/packages/raft-cli/docs/4.png" width="600"/>
