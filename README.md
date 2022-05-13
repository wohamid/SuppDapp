# DappDesk or sup-dapp

## script

To edit the script go to /src
It gets built with parcel into a static file that ends up deployed as public url.

Run `npm run script:build` to have a clean build of the script

Run `npm run script:watch` for it to auto-update - note parcel adds a bunch of runtime in that case

## backend

You need vercel installed. 
`npm i -g vercel`

put your secret in `.env` (see `.env.template`)

Run the backend with `npm run localdev` or run both backend and parcel build with `npm start`

Our API functions use cookies across origins when communicating with the widget, so each handler function needs to be wrapped with `allowCors()`

### script generation

A function that generates the script text to be pasted into someone's document:

`http://localhost:3000/api/generate2?address=123&projectName=karramba&page=http://localhost:3000/`

Returns

```

<script crossorigin="anonymous" src="http://SOMEADDRESS/script.js" integrity="sha384-UHGQoeHc2/oDidKGByyU2U6UhX+AXnUJVA+joolZ9HzHIN9rJPr2gB+uOjEthHSp">
<supp-dapp project="karramba" key="wuchVicBmAhm5FBoLaXhwg==:EuddMKJQXgNjqHA7rrN712Y8AauXxtMTrY0iMIb4xqQCmDRY4d0ezyFTxhVeX+iI" host="http://SOMEADDRESS/"></supp-dapp>
```

Remove the integrity bit when you want to reload while in development. 
When running localdev it seems vercel is passing some internal port to the host header, so the script url generated locally is not correct. It will work when deployed. For local run you need to replace stuff like `https://127.0.0.1:41487` with `http://localhost:3000`

## Widget

http://localhost:3000/simpletest.html is a page with embedded widget.
You can test widget behavior there. The key set up on the script is encrypted with values from .env.template

If you want to test the widget across origins, run in a separate terminal: `ngrok http 3000` and use the https URL that it gives you in `publis/simpletest.html` for `host` argument. That'll prove CORS work.
