# DappDesk or sup-dapp

## script

To edit the script go to /src
It gets built with parcel into a static file that ends up deployed as public url.

Run `npm run script:build` to have a clean build of the script

Run `npm run script:watch` for it to auto-update - note parcel adds a bunch of runtime in that case

## backend

You need vercel installed. 
`npm i -g vercel`

Run the backend with `npm run localdev` or run both backend and parcel watch with `npm start`

A function that generates the script text to be pasted into someone's document:

`http://localhost:3000/api/generate?wallet=123&projectName=kaboom`

Remove the integrity bit when you want to livereload while in development. 
