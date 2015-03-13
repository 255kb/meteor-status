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

Add the template before the `body` closing tag:

    <body>
        ...
        {{> meteorStatus}}
    </body>

