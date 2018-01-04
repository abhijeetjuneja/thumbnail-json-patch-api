# Express API for thumbnail generation along with Json Patching
ThumbX is an API used to create 50*50 thumbnail images as well as json patching.

## Routes Documentation (fire http://localhost:3000 in browser)

  1. User
    
    * Login - POST /users/login
    * Signup- POST /users/signup
    * Edit  - PUT  /users/:userId/edit

  2. Thumbnail

    * Create- POST /thumbnails/create

  3. Json Patch

    * Apply - POST /jsonpatch/apply


## Features

  1. User
   
    * Login route.
    * Signup route.
    * Edit account info route.

  2. Thumbnail
   
    * Create Thumbnail Route.

  4. Json Patching

    * Apply Json patch route


## Prerequisites

  1. NPM
  2. Node JS
  3. MongoDB
  4. Docker

## Installation

  1. Download or clone the repository.
  2. Unzip the downloaded folder.
  3. Through a terminal or Command Prompt all dependencies can be installed using the command "npm install".

## How to Run the Application(Locally)

  1. Install dependencies 'npm install'.
  2. Ensure that mongodb is running.
  3. Run 'node server.js'.
  4. Launch Postman to fire requests.
  5. For Routes Documentation , fire http://localhost:3000 in browser.
  6. For testing the application Fire 'npm test'
  7. Code coverage is generated after testing in coverage folder. Just open index.html.

## Technologies Used
  
### Backend

  	1. NodeJS
  	2. ExpressJS
  	3. MongoDB

## Tools

  1. Postman


## OS

  1. Ubuntu 16.04 LTS

## Editor
  
  1. Sublime-Text
