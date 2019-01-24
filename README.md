# Java Juke Frontend
The magic of a jukebox in the twenty-first century!


## Installation
These steps will guide you through installing JavaJuke on a Raspberry Pi. This has been tested on a Raspberry Pi 3, Model B running [Raspbian Stretch Lite](https://www.raspberrypi.org/downloads/raspbian/).

Firstly, there is a handful of dependencies that needs to be installed. These are git, npm and apache2. Installation guides for these are available on the internet, but in general it is along these lines:
```
$ sudo apt-get install git
$ sudo apt-get install nodejs npm
$ sudo apt-get install apache2
$ npm install -g polymer-cli
```

After the depencencies have finished installing, the application itself can be installed. This is done using git.
```
$ git clone https://github.com/daanhaitsma/javajuke.nl.git
$ cd javajuke.nl
$ npm install
```
After installing the dependencies, the connection to the API must be configured. In the `src/utils/apiHelper.js` the `apiBaseUrl` variable must be changed to the URL of the API.

## Running locally
```
$ polymer serve
```

## Building
```
$ polymer build
```

This will create a `build/default` folder, which can be served over the internet. For this, a VirtualHost must be set up in apache with the domain name `javajuke.nl`.
