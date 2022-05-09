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

Run the backend with `npm run localdev` or run both backend and parcel watch with `npm start`

A function that generates the script text to be pasted into someone's document:

`http://localhost:3000/api/generate?wallet=123&projectName=kaboom`

Returns

```
<script>
window['sup-dapp'] = {
  conf: {
  "projectName": "karramba"
}
  id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXQiOiIxMjMiLCJpYXQiOjE2NTIwODkyNjZ9.RDCXu01U5Mv361RYQ4Sv63zG-8t5z6ve2uBUS5VwphE',
}
</script>
<script defer crossorigin="anonymous" src="someurl/script.js" integrity="sha384-FkEpvP6qM5nBcOdPUr1cVkYANeZ6cJCC28gCVOHZT4Yp10rm3M4ctgmMThjTdrXL">
```

Remove the integrity bit when you want to livereload while in development. 
When running localdev it seems vercel is passing some internal port to the host header, so the script url generated locally is not correct. It will work when deployed. For local run you need to replace stuff like `https://127.0.0.1:41487` with `http://localhost:3000`
