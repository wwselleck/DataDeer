# DataDeer
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![deer](https://s-media-cache-ak0.pinimg.com/736x/3e/75/62/3e7562e3ef592b24e741ae61b5442cdc.jpg)]

Unofficial temporary mascot of DataDeer.

Use Google Drive as a simple CMS of your website.

_This project is not stable and should not be used unless you live on the edgiest edge__

# Getting Started
DriveCMS will serve your static, templated HTML files, and automatically fill it in with your data from Google Drive. This tutorial will walk you through the steps to setting up a site with DriveCMS. To get started, let's make a folder for our website.

```
~/Desktop $ mkdir example_website
```

Now, make an index.html file, open it up in whatever text editor you want, and fill it in with the standard HTML boilerplate.

```
~/Desktop/example_website $ touch index.html
~/Desktop/example_website $ vim index.html
```

```html
<!doctype html>
<html lang="en">
  <head>
    <title>My Site! :D</title>
  </head>
  <body>
    Welcome to My Site! Let me introduce myself...
  </body>
</html>
```

In our Google Drive, we're going to define some things about ourselves in a spreadsheet, and display it on our page. Head over to your Google Drive, create a folder called `ExampleSite`, and inside of that folder create a spreadsheet called `data`. Rename the first sheet to `info` and fill it in with the following data (replacing my info with whatever you want :P).

![](/docs/example_site/1.png)

Note that there is nothing special about any of the names used (ExampleSite, data, etc.), those are all configurable.

Unfortunately and fortunately, DriveCMS doesn't have magical access to any of your data, so we need to give it permission somehow. Authentication is worth an entire tutorial of it's own, so head over to the [authentication docs]() and go through the steps for setting up a service account. When you get your JSON file with all of the secret stuff in it, create a new folder called `creds` in your site root and move the file there.

```
~/Desktop/example_website $ mkdir creds
~/Desktop/example_website $ mv ~/Downloads/MyProject-123abc456def.json ./creds
```

> Remember to put the `creds` in your `.gitignore` if you're version controlling your website. You want to keep everything in there private.

We're ready to get a configuration file set up for our project. Create a file called `drivecms.config.js`, open it up in a text editor, and fill it in like this.

```
~/Desktop/example_website $ vim drivecms.config.js
```

```javascript
let path = require('path')

module.exports = {
  service_auth: {
    path: path.resolve(__dirname, 'creds', 'MyProject-123abc456def.json')
  },
  scopes: ['https://www.googleapis.com/auth/drive',
           'https://www.googleapis.com/auth/spreadsheets'],
  basedir: 'ExampleSite',
  data_tables: ['data']
}
```

There's a lot going on here so lets' break it down.

`service_auth`: This specifies the configuration for authenticating with the Service Account strategy. You could put the contents of the `MyProject...def.json` file in here directly, but it's better to instead give a path to the JSON file instead. That way you can include the `drivecms.config.js` file in your version control, while keeping the credentials out.

`basedir`: This is the folder that contains your data in Google Drive. It must have a unique name for DriveCMS to work correctly.

`data_tables`: This is a list of the files inside of the `base_dir` that contain data that you wish to load.

Now that we have some data, let's go back to our `index.html` and fill in the spots where we want that data to appear.

```html
<!doctype html>
<html lang="en">
  <head>
    <title>My Site! :D</title>
  </head>
  <body>
    Welcome to My Site! Let me introduce myself...
    My name is {{data.info.name}}. I go to {{data.info.school}} and am majoring in {{data.info.major}}. Here are some of the jobs I've had...
  </body>
</html>
```

When DriveCMS loads in your data from the data sheet, it exposes it to your HTML templates with a Javascript object of the following structure

```javascript
{
  "table_1_name": {
    "sheet_1_name": {
      "row_1_key": {
        "column_1_name": "column_1_data",
        "column_2_name": "column_2_data"
      }
    },
    "sheet_2_name": {
      "row_key": {
        "column_1_name": "column_1_data",
        "column_2_name": "column_2_data"
      }
    }
  }

}
```

In our case, the data object will look like this

```javascript
{
  "data": {
    "info": {
      "name": {
        "value": "Weston",
      },
      "school": {
        "value": "The University of Texas"
      },
      "major": {
        "value": "Computer Science"
      }
    }
  }
}
```

You can then access these values in your templates using Handlebars syntax. (e.g. `{{data.info.name.value}}`).

>DriveCMS uses [express-handlebars](https://github.com/ericf/express-handlebars) to handle templating, but currently doesn't support most of the more advanced features like partials (although hopefully it will soon).

We have one last step to do, and that's to move the `index.html` file into a folder named `public`. This is where DriveCMS goes to look for your HTML templates, and where all of your other assets will be served from.

```
~/Desktop/example_site $ mkdir public
~/Desktop/example_site $ mv index.html public
```

Great, we're done! Assuming you've installed DriveCMS globally, we can run the site by just executing `drivecms`.

```
~/Desktop/example_site $ drivecms
```

You should now be able to access your site at `locahost:3000`.

> The `drivecms` command must be executed in the same folder as the `drivecms.config.js` file.

Let's add some more stuff to our site.

![](/docs/example_site/2.png)

```html
<!doctype html>
<html lang="en">
  <head>
    <title>My Site! :D</title>
  </head>
  <body>
    Welcome to My Site! Let me introduce myself...
    My name is {{info.name}}. I go to {{info.school}} and am majoring in {{info.major}}. Here are some of the jobs I've had...
    {{#with data.jobs}}
    <table>
      <thead>
        <tr>
          <td>Company</td>
          <td>Position</td>
          <td>Location</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{job1.name}}</td>
          <td>{{job1.position}}</td>
          <td>{{job1.location}}/td>
        </tr>
         <tr>
          <td>{{job2.name}}</td>
          <td>{{job2.position}}</td>
          <td>{{job2.location}}/td>
        </tr>
         <tr>
          <td>{{job3.name}}</td>
          <td>{{job3.position}}</td>
          <td>{{job3.location}}/td>
        </tr>
    </table>
    {{/with}}
  </body>
</html>
```
Here you can see I used a second sheet named `jobs`, with a different data structure than the `info` sheet, to hold the data about my previous jobs. I've also used The handlerbars `with` helper to neaten it up.

Great, now we're using two different sheets to feed data into our page. The last thing I'll show in this tutorial is how you can use DriveCMS to easily insert images from your Google Drive into your webpage. Go ahead and add any image you want into your `ExampleSite` folder on Drive, and make sure it's set to "public". Then take note of that image's name, and insert it into a new `images` field in your `drivecms.config.js` file.

```javascript
let path = require('path')

module.exports = {
  service_auth: {
    path: path.resolve(__dirname, 'creds', 'MyProject-123abc456def.json')
  },
  scopes: ['https://www.googleapis.com/auth/drive',
           'https://www.googleapis.com/auth/spreadsheets'],
  basedir: 'ExampleSite',
  data_tables: ['data'],
  images: ['winnie.jpg']
}
```

DriveCMS will find all of the images you've specified in this list and add the URLs to them in a special `images` field on your data object. To use them in your page, just add that object property as the `src` in an image tag.

```html
<!doctype html>
<html lang="en">
  <head>
    <title>My Site! :D</title>
  </head>
  <body>
    <img src="{{images.[winnie.jpg]}}">
    Welcome to My Site! Let me introduce myself...
    My name is {{info.name}}. I go to {{info.school}} and am majoring in {{info.major}}. Here are some of the jobs I've had...

    ...
  </body>
</html>
```
You'll want to take note of that weird syntax. This is the way Handlebars allows us to access field names that contain a `.`.

If you restart the server, you should be able to see your picture!
