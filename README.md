# Meteor Status

## What is it?
Meteor Status is a package which automatically alerts users when the connection to the server has been lost.
It also shows a countdown (in seconds) until the next retry and allows users to manually retry in the meantime.

The alert is fixed at the bottom of the screen and the design is based on Google's [Material Design snackbars](http://www.google.com/design/spec/components/snackbars-toasts.html).

Here is how it looks like:

![Meteor Status screenshot](docs/screenshot.png)

This package should be compatible with packages like [Smart Disconnect](https://github.com/mixmaxhq/meteor-smart-disconnect) as the alert does not show up in case of a manual disconnect (triggered with `Meteor.disconnect()`).

## Installation

Add the package in your Meteor application with this command:

```
meteor add 255kb:meteor-status
```

## Usage

Add the template before the `body` closing tag or anywhere else if you use the option `style=false` (see below):

    <body>
        ...
        {{> meteorStatus}}
    </body>


## Options

You can add the following options to the template: 

- `style=false`: remove style/UI/bottom placement (only displays the text and the link in a `<div>`)
- `lang='en'`: change language (currently **fr** and **en** supported, default to **en**)


    <body>
        ...
        {{> meteorStatus style=false lang='fr'}}
    </body>


## Changelog

### v1.2.0:
- Improved default design (font and link style)
- Option to disable UI/design (text only) 
- switch to local reactive vars instead of session vars
- added i18n support and French language