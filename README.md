## *Ample*: A simple web browser client for [Ampache](https://ampache.org/) with *music-only* libraries

[View demo](https://develop.ampache.dev/ample/) (user ```demo``` password ```demodemo```)

Built with [Svelte](https://svelte.dev/) & [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)

<img src="https://user-images.githubusercontent.com/5735900/150520027-7e351113-29a9-4919-b3e2-10265f6aa524.jpg" width=800 alt="Ample screenshot" />

## Features
- Available on the [wiki](https://github.com/mitchray/ample/wiki/Features)

## Requirements
- Ampache 5.x
- A modern desktop web browser (Chrome/Edge 88+, Firefox 78+, Safari 14+)
- Apache for a small .htaccess URL rewrite, or [NGINX](https://github.com/mitchray/ample/wiki/NGINX-rewrite)

## Installing
- Prebuilt [release](https://github.com/mitchray/ample/releases): Copy the ```ample``` folder into your Ampache ```public``` folder, done!
- Git branch: I recommend creating a symbolic link within your Ampache public folder, otherwise if you have CORS configured on your server you can override the ```detectedURL``` in ```src/stores/server.js```

## Accessing
- Add ```/ample``` to your Ampache server address. e.g ```yourampache.com/ample```

## Developing
- Clone the Ample repository and from the ample directory ```cd ample```
- Install packages ```npm install```
- For development and hot reloading ```npm run dev```
- For building ```npm run build```

Additional console logging can be enabled by setting ```debugMode true``` in ```src/stores/server.js```
