
## Features

Below are the basic features for the application:

- user can see the existing images from folder `images` to the images list
- user can *upload image* to folder `images` and directly added to images list
- user can *add and remove image / text* from the menu to the canvas
- user can *move the image / text* around the canvas
- the created objects on canvas can be saved and repopulated on refresh browser


## How To Install

To set up the environment dependencies ( node version 5++ )

```
$ npm install
```

To run the node server

```
$ npm run start
```

note: you should run dev server and running node server

Run dev server

```
$ npm run dev
```

open browser and enter url: http://localhost:1122

## How to test locally

```
# npm run test
```

### API

#### get uploaded images

```
GET /images
```

#### upload image to server

```
POST /uploads
```

### Note

_- The name of the file input has to be `upload` as this is what the server will be reading from_
_- The server only accepts `png` and `jpeg` file format_
_- You are allowed to edit the server.js file_

### Structure

The control code is in `app/index.js`.

### Where uploaded file stored

In uploads folder.

### How to distribute the code

```
$ npm run build
```

The generated codes and file is in `dist` folder.


### How to delete an image or text on canvas

Select the image/text, press cmd+delete (on mac) or ctrl+delete (on pc)

This shortcut was tested and run well on mac
